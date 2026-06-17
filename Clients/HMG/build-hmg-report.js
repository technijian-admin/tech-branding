// The Holman Group (HMG) — Co-Managed IT, Security & AI Strategy Brief
// Technijian-branded DOCX builder. FACTS-ONLY by directive (Ravi, 2026-06-16):
// report only verified facts; turn every unknown into a client question.
// Authentic logo (assets/ root file), NOT the brand-tokens AI-fake path.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  TabStopType, TabStopPosition, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, TableOfContents
} = require('C:/vscode/tech-branding/tech-branding/node_modules/docx');

// ---------- Brand constants ----------
const tokens = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE     = strip(tokens.color.primary.blue.$value);   // 006DB6
const CORE_ORANGE   = strip(tokens.color.primary.orange.$value); // F67D4B
const TEAL          = strip(tokens.color.secondary.teal.$value); // 1EAAC8
const CHARTREUSE    = strip(tokens.color.secondary.chartreuse.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);   // 1A1A2E
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value); // 59595B
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);
const PASS          = strip(tokens.color.status.pass.$value);
const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

// AUTHENTIC logo (assets/ root) copied locally — AR 4.779
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 16, 2026';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) {
  return new Paragraph({ keepNext: true, spacing: { before: size, after: 0 }, children: [new TextRun({ text: '' })] });
}
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140, font = FONT_BODY } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font })] });
}
function pRuns(runs, opts = {}) {
  const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY,
      bold: r.bold || false, italics: r.italics || false, font: r.font || FONT_BODY })) });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true,
    spacing: { before: 0, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ] })] });
  return [headingPara, visualTable, spacer(120)];
}
function plainHeader(text, color = CORE_BLUE) {
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: 1 })] }), visual, spacer(120)];
}
function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 27 } = opts;
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 300, after: 130 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, spacing: { before: 220, after: 90 },
    children: [new TextRun({ text, size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] });
}
const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })] });
}
function bulletRuns(runs) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 },
    children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) });
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ] })] });
}
function kpiCell(number, label, color, w) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 110, right: 110 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 48, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}
function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalW = columns.reduce((s, c) => s + c.weight, 0);
  const colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalW)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 110, bottom: 110, left: 130, right: 130 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 19, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    const texts = Array.isArray(cellObj.text) ? cellObj.text : [cellObj.text];
    const paras = texts.map(t => new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, spacing: { before: 0, after: 30, line: 276 },
      children: [new TextRun({ text: t, size: 19, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, italics: cellObj.italics || false, font: FONT_BODY })] }));
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 90, bottom: 90, left: 130, right: 130 }, verticalAlign: VerticalAlign.TOP, children: paras });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ tableHeader: true, children: headerCells }), ...dataRows] });
}
function colorBar(color, heightDXA = 60) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ height: { value: heightDXA, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] });
}
function centered(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 120, before = 0 } = opts;
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] });
}

// ============================================================
// COVER
// ============================================================
const cover = [
  colorBar(CORE_BLUE, 200),
  spacer(820),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
    children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian Logo', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(340),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }),
  spacer(220),
  centered('CO-MANAGED IT, SECURITY', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('& AI STRATEGY BRIEF', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }),
  spacer(160),
  centered('The Holman Group', { size: 54, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: 'What we verified, where Technijian fits, and the questions that complete the picture', size: 23, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(1000),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Deric Hobbie, Network Administrator — The Holman Group', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · A PRE-DISCOVERY BRIEFING FOR THE HOLMAN GROUP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================
// HOW TO READ THIS BRIEF (method note) + TOC
// ============================================================
const methodNote = [
  ...plainHeader('How to Read This Brief'),
  p('This document was prepared before any technical discovery. It deliberately does two things and nothing else:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports only verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about The Holman Group is drawn from public sources or from your introductory conversation with Lewis, and is cited in the Appendix. We have not assumed anything about your internal environment, security tooling, or compliance posture.' }]),
  bulletRuns([{ text: 'It turns every unknown into a question. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we do not guess — we ask. Section 10 is a structured questionnaire; your answers (or a free Nexus Assess) complete the analysis and unlock real, costed recommendations.' }]),
  p('Numbers describing the wider market, the threat landscape, and industry AI outcomes are facts about that market — sourced and labeled — not predictions about The Holman Group. Any figure specific to your organization is intentionally left open until discovery.', { spaceBefore: 60, spaceAfter: 120 }),
  calloutBox('A note on honesty', 'Technijian would rather under-claim and verify than over-claim and walk it back. Where we have inferred something (for example, a software platform named on your website), we say so and flag it for confirmation. You should expect the same discipline in every deliverable we produce for you.', TEAL),
];

const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', {
    hyperlink: true,
    headingStyleRange: '1-1',
  }),
];

// ============================================================
// EXECUTIVE SUMMARY
// ============================================================
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('The Holman Group is a California Knox-Keene–licensed, URAC-accredited behavioral-health and Employee Assistance Program (EAP) company that has operated since 1979 and serves what it describes as millions of members. You run your own in-house IT, led by a Network Administrator, across roughly 60 computers and on-premises servers. You asked to explore whether an outside partner could complement that team — co-managed IT, help desk, cybersecurity, and strategic support.', { spaceAfter: 120 }),
  p('This brief makes the case on two fronts at once, then hands the specifics back to you:', { spaceAfter: 120 }),
  kpiRow([
    { number: '1979', label: 'Founded · 40+ yrs in behavioral health', color: CORE_BLUE },
    { number: '5', label: 'Overlapping data-protection regimes', color: CORE_ORANGE },
    { number: '$7.42M', label: 'Avg. healthcare breach, 2025 (IBM)', color: CRITICAL },
    { number: '$200–360B', label: 'Annual US healthcare AI opportunity', color: TEAL },
  ]),
  spacer(160),
  pRuns([
    { text: 'Front one — protect and co-manage. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Behavioral-health data sits under HIPAA, 42 CFR Part 2, California’s CMIA, DMHC (Knox-Keene) oversight, and URAC accreditation — simultaneously. That is more continuous security and evidence work than any single in-house administrator can staff around the clock. Co-managed IT keeps your team in charge while Technijian adds the 24/7 SOC, after-hours coverage, security tooling, and audit-ready compliance evidence that one person cannot sustain alone.' },
  ], { spaceAfter: 120 }),
  pRuns([
    { text: 'Front two — integrate AI for efficiency. ', bold: true, color: DARK_CHARCOAL },
    { text: 'The operations you already run — EAP intake, a 24/7 member and crisis line, claims, and utilization management — are exactly where the healthcare industry is applying AI today, as an assistant to your staff rather than a replacement. We map those industry patterns onto your actual operations, with the honest caveat that AI augments clinical and service judgment; it never makes it autonomously.' },
  ], { spaceAfter: 120 }),
  pRuns([
    { text: 'The method is deliberately conservative. ', bold: true, color: DARK_CHARCOAL },
    { text: 'You will not find an invented price or a guessed ROI in this document. The market ranges in Section 9 are labeled market-typical, not quotes. The real numbers come after a free, no-obligation Nexus Assess of your environment, or after you answer the questionnaire in Section 10 — whichever you prefer. That is how a brief becomes a costed plan.' },
  ], { spaceAfter: 120 }),
  calloutBox('The single idea to carry into the meeting',
    'Co-managed means Technijian works for your team, not instead of it. On your worst week we are the bench you call; on a normal week you barely notice us — and your Network Administrator grows by working alongside a 25-year, security-first, AI-forward team.', CORE_ORANGE),
];

// ============================================================
// SECTION 01 — WHAT WE VERIFIED
// ============================================================
const section1 = [
  ...sectionHeader('What We Verified About The Holman Group', CORE_BLUE, '01'),
  p('Everything in this section is drawn from The Holman Group’s own website, its LinkedIn presence, public regulatory records, or your introductory conversation. Sources are listed in the Appendix.', { spaceAfter: 140 }),
  subHeader('Company snapshot'),
  buildTable(
    [{ label: 'Attribute', weight: 30 }, { label: 'Verified fact', weight: 70 }],
    [
      [{ text: 'Business', bold: true }, 'National behavioral-health & Employee Assistance Program (EAP) company; managed behavioral health care plans, mental-health and substance-abuse carve-outs, ASO programs, and a 24/7/365 crisis line.'],
      [{ text: 'Founded', bold: true }, '1979 — more than four decades in behavioral health.'],
      [{ text: 'Headquarters', bold: true }, 'Canoga Park, California (Los Angeles area); a second location in Arizona is listed on LinkedIn.'],
      [{ text: 'Licensure', bold: true }, 'California Knox-Keene licensed since 1985; regulated by the Department of Managed Health Care (DMHC).'],
      [{ text: 'Accreditation', bold: true }, 'URAC accredited since 2015 — Credentials Verification (CVO), Utilization Management (UM), and Health Network (HN).'],
      [{ text: 'Leadership', bold: true }, 'Kwasi Holman, President & Chief Executive Officer.'],
      [{ text: 'Scale', bold: true }, 'LinkedIn lists the 51–200 employee band (about 97 employees, ~604 followers); the company states it has serviced millions of members.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What you told us (introductory call)'),
  p('From your conversation with Lewis, we recorded the following — and treat each as a starting point to confirm, not a settled fact:', { spaceAfter: 100 }),
  bullet('Approximately 60 computers / endpoints.'),
  bullet('On-premises servers (an internally hosted environment, not fully cloud).'),
  bullet('An in-house IT team, with Deric Hobbie serving as Network Administrator.'),
  bullet('An interest in co-managed IT, help desk, cybersecurity posture, and strategic IT support that complements the in-house team rather than replacing it.'),
  subHeader('The applications a plan like this has to keep running'),
  p('Your public website exposes several member- and provider-facing applications. Each is an internet-facing system that must be supported, patched, and secured — and each is a natural place where a co-managed partner adds value:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'System (observed on your site)', weight: 34 }, { label: 'What it implies for IT & security', weight: 66 }],
    [
      ['Provider Search / "See My Plan" lookup', 'A public, internet-facing member tool — uptime, performance, and exposure to web attack all matter.'],
      ['Provider Portal + Reserve Network Application', 'Authenticated provider workflows handling network and credentialing data — access control and audit logging are in scope.'],
      ['"For Members" portal', 'Member-facing access to behavioral-health benefits — protected health information (PHI) in motion.'],
      [{ text: 'QuickCap provider portal (claims / UM / authorizations)' }, 'Indicates a managed-care claims, utilization-management, and authorization platform behind the site — a core system of record. (Platform named on your site; specifics to confirm.)'],
      ['Classic ASP.NET (.aspx) web stack', 'Consistent with a Windows / IIS server environment — aligns with the on-premises servers you described.'],
    ], { headerColor: TEAL }),
  spacer(120),
  calloutBox('What we have NOT assumed — and will confirm with you',
    ['We do not know, and have not guessed: the exact number and roles of your servers; your endpoint and Microsoft 365 footprint; your current security tooling (EDR, SIEM, email security, MFA); your backup and disaster-recovery design; or how you produce compliance evidence today.',
     'These are precisely the questions in Section 10. A free Nexus Assess answers most of them with hard data rather than conversation.'], CORE_ORANGE),
];

// ============================================================
// SECTION 02 — COMPLIANCE REALITY
// ============================================================
const section2 = [
  ...sectionHeader('The Compliance Reality — Five Overlapping Regimes', CORE_BLUE, '02'),
  p('A Knox-Keene–licensed, URAC-accredited managed behavioral-health plan that handles PHI sits at the intersection of five data-protection regimes at once. This is among the most heavily regulated data environments in the country — and it is the clearest reason a single in-house administrator benefits from a co-managed security partner.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Regime', weight: 22 }, { label: 'What it governs', weight: 40 }, { label: 'IT / security implication', weight: 38 }],
    [
      [{ text: 'HIPAA', bold: true, color: CORE_BLUE }, 'Federal privacy & security floor for ePHI (administrative, physical, technical safeguards).', 'A 2025 OCR proposal (NPRM) would make MFA, encryption at rest and in transit, annual penetration testing, and vulnerability scans every six months mandatory — removing the "addressable" exception.'],
      [{ text: '42 CFR Part 2', bold: true, color: CORE_BLUE }, 'Heightened federal protection for substance-use-disorder (SUD) records — which your carve-outs and drug-compliance services involve.', 'A 2024 SAMHSA final rule added civil money penalties; enforcement became active in February 2026. Consent, breach handling, and counseling-note protections are stricter than HIPAA alone.'],
      [{ text: 'CMIA (California)', bold: true, color: CORE_BLUE }, 'State Confidentiality of Medical Information Act — binds health plans and their contractors.', 'Penalties stack per record: administrative fines, up to $25,000 per patient for intentional misconduct, and a private right of action — a large breach is an existential financial exposure.'],
      [{ text: 'DMHC (Knox-Keene)', bold: true, color: CORE_BLUE }, 'California Department of Managed Health Care licenses and supervises the plan.', 'Ongoing, regulator-facing compliance reporting obligations that IT can help evidence and automate.'],
      [{ text: 'URAC', bold: true, color: CORE_BLUE }, 'Accreditation standards for UM, Health Network, and Credentialing.', 'Recurring, audited requirements for privacy, security, data governance, and staff security training — re-accreditation is not one-and-done.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('Why this is timely',
    ['Two dated triggers make security investment less optional than it was a year ago: (1) the HIPAA Security Rule update (OCR NPRM, January 2025) is expected to mandate MFA, encryption, annual penetration testing, and six-month vulnerability scans; and (2) 42 CFR Part 2 enforcement, with civil money penalties, became active in February 2026.',
     'We present these as facts about the regulatory calendar, not as claims about your current posture — which only your team or an assessment can establish.'], CRITICAL),
];

// ============================================================
// SECTION 03 — THREAT LANDSCAPE
// ============================================================
const section3 = [
  ...sectionHeader('The Behavioral-Health Threat Landscape', CORE_BLUE, '03'),
  p('The following are facts about the healthcare threat environment in which any behavioral-health plan operates. They are not statements about The Holman Group’s defenses, which we have not assessed.', { spaceAfter: 130 }),
  kpiRow([
    { number: '$7.42M', label: 'Avg. healthcare breach cost, 2025 — #1 of all sectors (IBM)', color: CRITICAL },
    { number: '~279', label: 'Days to detect & contain a healthcare breach (IBM)', color: CORE_ORANGE },
    { number: '211', label: 'Healthcare ransomware attacks, H1 2025 (Comparitech)', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  subHeader('Why behavioral-health PHI is a premium target'),
  bulletRuns([{ text: 'Records are worth far more than card numbers. ', bold: true, color: DARK_CHARCOAL }, { text: 'Medical records sell for roughly $250–$1,000 each on dark-web markets versus $5–$25 for a credit card — and PHI cannot be cancelled or reissued, enabling long-term fraud.' }]),
  bulletRuns([{ text: 'It is uniquely weaponizable. ', bold: true, color: DARK_CHARCOAL }, { text: 'In the Vastaamo breach, patients of a mental-health provider were individually extorted with their own therapy notes. For a behavioral-health plan, a breach is not only a regulatory fine — it is the risk of members being personally blackmailed with their most sensitive records.' }]),
  bulletRuns([{ text: 'Scale is large and rising. ', bold: true, color: DARK_CHARCOAL }, { text: 'In 2025, U.S. regulators logged 697 large healthcare breaches exposing more than 61 million individuals; the average healthcare ransom demand is around $7 million.' }]),
  spacer(80),
  calloutBox('The honest framing',
    'We do not raise this to alarm you — your team may already manage these risks well. We raise it because the floor for "good enough" security is objectively higher for behavioral-health PHI than for ordinary business data, and because the cost of a single incident dwarfs the cost of continuous protection. The right next step is to measure your actual exposure, not to assume it.', TEAL),
];

// ============================================================
// SECTION 04 — CO-MANAGED MODEL
// ============================================================
const section4 = [
  ...sectionHeader('The Co-Managed Model — Augment, Don’t Replace', CORE_BLUE, '04'),
  p('Co-managed IT is a specific, well-established model: your internal team keeps ownership of IT strategy and institutional knowledge, while an outside partner adds tooling, specialized skills, and around-the-clock manpower. The industry driver is no longer cost — it is the skills gap. Mid-market organizations cannot recruit and retain the specialized security and cloud talent that a managed provider employs at scale (CompTIA).', { spaceAfter: 140 }),
  subHeader('What one in-house administrator cannot staff alone'),
  p('This is not a comment on capability — it is arithmetic. The items below require either 24/7 staffing, specialized tooling, or dedicated bandwidth that a single administrator running daily operations cannot also provide:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Capability gap', weight: 32 }, { label: 'Why it needs a partner', weight: 68 }],
    [
      ['24/7 SOC & SIEM monitoring', 'Attacks land after hours and on weekends — exactly when a one-person team is offline. Your own crisis line runs 24/7; your monitoring should too.'],
      ['After-hours & overflow help desk', 'Coverage during evenings, weekends, sick days, and vacations — so your administrator can take time off without the organization going dark.'],
      ['Security tooling at scale', 'EDR/MDR, email security, vulnerability scanning, and backup — bought, integrated, and tuned by specialists rather than assembled solo.'],
      ['Compliance evidence production', 'HIPAA risk analyses and the Part 2 / CMIA / URAC / DMHC artifacts, policy library, and audit support that are a job in themselves.'],
      ['Project bandwidth', 'Server refreshes, Microsoft 365 hardening, and encryption rollouts — without pulling your administrator off daily operations.'],
      ['vCIO / vCISO strategy', 'A strategic planning, board-reporting, and risk-register cadence that no organization this size staffs as a full-time role.'],
    ], { headerColor: CORE_ORANGE }),
  spacer(120),
  calloutBox('The emotional truth, said plainly',
    'Co-management augments your Network Administrator; it does not replace him. He keeps control of the relationship and the roadmap, gains a named Technijian pod that learns your environment, and grows by working next to senior engineers and a security team. The healthcare-specific version: the partner can own the security and compliance functions while your in-house team keeps the business applications — QuickCap, the provider and member portals, and EAP intake — running.', CORE_BLUE),
];

// ============================================================
// SECTION 05 — CAPABILITY MAP
// ============================================================
const section5 = [
  ...sectionHeader('Technijian Capability Map', CORE_BLUE, '05'),
  p('Technijian is an Irvine-based IT services company founded in 2000, with a Panchkula, India delivery center for 24/7 follow-the-sun coverage. We are cybersecurity-first (CISSP-led, with our own Security Operations Center) and AI-forward (we build, not just resell). The table maps our actual service lines to the categories of need a behavioral-health plan like yours typically has. Which of these apply to you is a discovery question, not an assumption.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Need category', weight: 30 }, { label: 'Technijian service', weight: 22 }, { label: 'What it delivers', weight: 48 }],
    [
      ['Co-managed help desk & operations', { text: 'My IT', bold: true, color: CORE_BLUE }, 'Tier-1/2 overflow, after-hours coverage, monitoring, patching, and Microsoft 365 administration alongside your team.'],
      ['24/7 security monitoring & response', { text: 'My Security', bold: true, color: CORE_BLUE }, 'SOC, EDR/MDR, identity hardening, and incident response — the around-the-clock layer.'],
      ['Email & phishing defense', { text: 'My AntiSpam', bold: true, color: CORE_BLUE }, 'Managed email security (anti-phishing / anti-spam) at a published $4.75 per user per month.'],
      ['Compliance evidence & frameworks', { text: 'My Compliance', bold: true, color: CORE_BLUE }, 'HIPAA risk analyses, policy libraries, and audit-ready evidence; framework support spanning HIPAA, SOC 2, PCI, and GDPR.'],
      ['Backup, continuity & DR', { text: 'My Continuity', bold: true, color: CORE_BLUE }, 'Immutable, tested backups of servers and Microsoft 365 with defined recovery objectives.'],
      ['Security visibility & reporting', { text: 'My Jian', bold: true, color: CORE_BLUE }, 'A Technijian-built platform that aggregates signals across your tools into a plain monthly security report.'],
      ['Practical AI & custom builds', { text: 'My AI / My Dev', bold: true, color: CORE_BLUE }, 'Document intelligence, workflow automation, and custom development — the efficiency front in Section 7.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('How we work — representative engagement profiles'),
  p('These are the shapes of work we deliver, anonymized and described by scope only — no client names and no cherry-picked outcome numbers:', { spaceAfter: 100 }),
  calloutBox('Profile A — Regulated healthcare, co-managed',
    'A multi-site healthcare organization with its own IT lead. Scope: hardened Microsoft 365, EDR across endpoints and servers, a HIPAA Security Rule risk assessment, and audit-ready evidence — delivered alongside the in-house administrator, who kept control throughout.', CORE_BLUE),
  calloutBox('Profile B — On-premises servers + in-house team',
    'A mid-market organization with on-premises servers and a small internal team carrying the after-hours pager. Scope: a 24/7 SOC overlay and after-hours help desk so the internal staff regained nights and weekends, with patch and backup discipline tightened across the server estate.', CORE_ORANGE),
  calloutBox('Profile C — Claims / benefits operations',
    'A benefits-operations workflow heavy with manual document handling. Scope: AI document-intelligence and workflow automation explored to reduce repetitive processing — the same pattern we would look at for EAP intake and claims, once the IT foundation is solid.', TEAL),
  subHeader('"Won’t AI cost a fortune?" — the multi-model discipline'),
  p('A fair question whenever AI is on the table. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three vendors and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume extraction and classification, mid-tier models for the bulk of reasoning and drafting, and frontier models reserved for the small slice that genuinely needs deep judgment. Where quality is non-negotiable, multiple models peer-review the same output. In practice this runs roughly 60–80% below the cost of routing everything to a single premium model, with no quality loss on the work that matters — and private, governed deployments mean sensitive data never reaches a public tool.', { spaceAfter: 120 }),
];

// ============================================================
// SECTION 06 — SECURITY & COMPLIANCE ARCHITECTURE
// ============================================================
const section6 = [
  ...sectionHeader('Security & Compliance Architecture', CORE_BLUE, '06'),
  p('A behavioral-health plan has to cover six security layers, and produce evidence that each is working. Any one is buildable in-house; the difficulty is running all six continuously, with documentation a regulator will accept. The table describes what each layer covers and the regimes it maps to — a structure we would tailor to your environment after discovery, never impose before it.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Layer', weight: 24 }, { label: 'What it covers', weight: 46 }, { label: 'Maps to', weight: 30 }],
    [
      [{ text: 'Identity & access', bold: true, color: CORE_BLUE }, 'MFA on every login, conditional access, privileged-account control. Most breaches begin at a stolen sign-in.', 'HIPAA (NPRM MFA), URAC'],
      [{ text: 'Endpoints & servers', bold: true, color: CORE_BLUE }, 'EDR/threat detection on every laptop and on-prem server, disk encryption, enforced patching — on and off network.', 'HIPAA, CMIA'],
      [{ text: 'Email & web defense', bold: true, color: CORE_BLUE }, 'Anti-phishing, malicious-link protection, DNS/web filtering. Healthcare is the most-phished sector.', 'HIPAA'],
      [{ text: 'Data, backup & ransomware', bold: true, color: CORE_BLUE }, 'Immutable, tested backups of servers and Microsoft 365; rapid, verified recovery. Encryption is the breach safe-harbor.', 'HIPAA (NPRM encryption), CMIA'],
      [{ text: 'Compliance evidence', bold: true, color: CORE_BLUE }, 'Risk analysis, policies, and audit-ready documentation produced continuously, not at audit time.', '42 CFR Part 2, CMIA, DMHC, URAC'],
      [{ text: '24/7 SOC & response', bold: true, color: CORE_BLUE }, 'Eyes-on-glass monitoring with a defined response — the coverage an in-house team cannot staff alone.', 'HIPAA, URAC'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('Built to where the rules are going',
    'The proposed HIPAA Security Rule update points squarely at MFA, encryption at rest and in transit, annual penetration testing, and six-month vulnerability scanning. Those are not exotic asks — they are exactly what a modern co-managed security program delivers as a matter of course. Meeting them is far cheaper as a planned program than as a post-breach scramble.', CORE_ORANGE),
];

// ============================================================
// SECTION 07 — AI OPPORTUNITY
// ============================================================
const section7 = [
  ...sectionHeader('The AI Integration Opportunity', CORE_BLUE, '07'),
  p('The second front is efficiency. The operations The Holman Group already runs are the same operations where the healthcare industry is applying AI today. The table pairs an operation we verified you run with the corresponding industry AI pattern and a sourced peer outcome. Read the outcomes as what the market is reporting — some measured, some directional analyst projections — not as guarantees for your organization.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Holman operation (verified)', weight: 26 }, { label: 'Industry AI pattern', weight: 38 }, { label: 'Sourced peer outcome', weight: 36 }],
    [
      ['EAP intake & benefit verification', 'AI-assisted intake and benefits checking across payer networks.', 'Manual benefit verification runs 10–20 min per client; one vendor reports ~30% more intake (vendor-reported).'],
      ['24/7 member & crisis line', 'AI assistants that resolve routine calls and cut wait time, escalating sensitive contacts to humans.', 'Up to ~40% of interactions resolved autonomously; average wait cut from ~14 min to under a minute (customer case studies).'],
      ['Claims (QuickCap)', 'AI pre-submission claim scrubbing and adjudication support.', 'Up to ~70% lower claim intake-gateway cost; ~25% lower processing cost over 2–3 years (Cognizant).'],
      ['Utilization management (URAC UM)', 'Gen-AI to streamline prior authorization and reviews — assistive, with clinician sign-off.', '~25–40% lower administrative cost in targeted payer workflows (McKinsey).'],
      ['Provider network & search', 'AI matching and network-data hygiene behind provider search.', 'Improved match quality and reduced manual maintenance (industry pattern).'],
    ], { headerColor: TEAL }),
  spacer(120),
  pRuns([
    { text: 'The size of the prize, and the guardrail. ', bold: true, color: DARK_CHARCOAL },
    { text: 'A McKinsey–Harvard analysis estimates wider AI adoption could save US healthcare $200–360 billion a year (5–10% of spend), with private payers specifically in the 7–9% range. The guardrail is non-negotiable and we lead with it: AI here is assistive. Several states and CMS already restrict AI from making prior-authorization denials without clinician review — so we design AI to draft, summarize, and triage for your staff, never to make a clinical or coverage decision on its own.' },
  ], { spaceAfter: 120 }),
  calloutBox('How this stays honest',
    'We will not put a dollar of "AI savings" specific to The Holman Group in writing until we know your real volumes — calls, claims, intake, authorizations — and your current tooling. Those are questions in Section 10. The industry numbers above tell you the opportunity is real; only your data tells you its size.', CORE_ORANGE),
];

// ============================================================
// SECTION 08 — UNDERSTANDING AI (education layer)
// ============================================================
const section8 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '08'),
  p('A short, vendor-neutral primer so the conversation rests on shared ground rather than hype. Each point is anchored to an independent framework, not a sales claim.', { spaceAfter: 130 }),
  h3('What AI is — and the one distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction comes from Anthropic’s engineering guidance: ', }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a predefined path — predictable, low-risk, e.g. "draft this from these inputs") versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself — flexible, needs oversight). The operating principle is to use the simplest thing that works: start with simple automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer, so a human reviews anything member-facing or compliance-bound.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— PHI and SUD records never go into public AI tools; we use private, governed deployments.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool is inventoried with an owner, vendor, and data source, straight from the NIST "Govern" function.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Do-it-yourself tools are cheap but leave you to assemble and govern the system — and to own the three risks above. A capable full-time AI hire costs well over $180,000 a year, is scarce, and cannot cover strategy, build, security, and governance alone. A partner provides all four at a fraction of the cost, with proven builds and CISSP-led security — which matters more, not less, when the data is behavioral-health PHI.', { spaceAfter: 120 }),
];

// ============================================================
// SECTION 09 — MARKET CONTEXT & INVESTMENT FRAMEWORK
// ============================================================
const section9 = [
  ...sectionHeader('Market Context & Investment Framework', CORE_BLUE, '09'),
  p('No price in this section is a quote for The Holman Group. These are market-typical ranges for the separate services an organization usually buys from different vendors — shown to make the consolidation argument, and to set honest expectations. Your actual figure is scoped only after a free Nexus Assess.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Service line', weight: 34 }, { label: 'Market-typical range (2026)', weight: 36 }, { label: 'Note', weight: 30 }],
    [
      ['Co-managed IT (per user / month)', '$110–$400; mid-market 50–250 users $150–$250', 'Velo, VC3'],
      ['24/7 SOC / MDR', '$10–$30 / endpoint / mo; small orgs $1,500–$5,000 / mo', 'UnderDefense, Expel'],
      ['vCISO', '$3,000–$12,000 / mo (vs. $270K–$425K/yr full-time CISO)', 'SideChannel, Cynomi'],
      ['HIPAA risk assessment / compliance', 'analysis $2K–$20K; ongoing $2K–$15K / yr', 'Secureframe'],
      ['Email security', '~$3–$6 / user / mo (Technijian My AntiSpam $4.75 in-band)', 'directional'],
      ['M365 / cloud backup', '~$3–$7 / user / mo', 'directional'],
      ['Security-awareness training', '~$1–$5 / user / mo', 'directional'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  pRuns([
    { text: 'The consolidation argument. ', bold: true, color: DARK_CHARCOAL },
    { text: 'At market-typical mid-market rates, co-managed IT alone for roughly 60 seats runs about $9,000–$15,000 per month before any standalone SOC, vCISO, or compliance line — which is exactly why consolidating most of that stack into one co-managed relationship, one team, and one bill is usually both simpler and more economical. The structural reason Technijian can do the same work for less is a senior U.S.-led, India-delivered model — presented as one blended rate, not a stack of line items.' },
  ], { spaceAfter: 120 }),
  calloutBox('How a real number gets set',
    'We quote from data, not assumptions. A free Nexus Assess inventories your environment; from there we build a fixed, per-line proposal covering only the layers you want, with nonprofit / volume Microsoft 365 licensing applied where eligible. Every line is explained; nothing is hidden.', TEAL),
];

// ============================================================
// SECTION 10 — QUESTIONS TO COMPLETE THE ANALYSIS
// ============================================================
function qGroup(title, color, items) {
  return [subHeader(title, { color }), ...items.map(q => bullet(q))];
}
const section10 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '10'),
  p('This is the heart of the brief. Everything above is what we could verify or source; the analysis becomes real and costed only when these are answered — by your team, or by a free Nexus Assess that measures most of them directly. There are no wrong answers, and "we’re not sure" is useful information.', { spaceAfter: 130 }),
  ...qGroup('A · IT environment & infrastructure', CORE_BLUE, [
    'How many physical and virtual servers do you run, and what does each do (domain/AD, file, application, SQL, line-of-business such as QuickCap)?',
    'How many endpoints in total, and what operating-system versions (any Windows 10 / end-of-life systems)?',
    'What is on-premises today versus already in Microsoft 365 / the cloud? Are you on Microsoft 365, and which plan?',
    'How is the network laid out across your locations (Canoga Park, Arizona, remote staff), and how do remote users connect?',
    'How are servers and endpoints backed up today, and when was the last successful test restore?',
    'What is the age and refresh status of your core server and network hardware?',
  ]),
  ...qGroup('B · Security posture & tooling', CORE_ORANGE, [
    'What endpoint protection / EDR, SIEM, and email-security products are in place today?',
    'Is multi-factor authentication enforced for all users, including remote access and Microsoft 365?',
    'When was your last HIPAA Security Risk Assessment, and your last penetration test or vulnerability scan?',
    'Who monitors security alerts after hours and on weekends today?',
    'Do you have a written incident-response plan, and has it been exercised?',
    'Is data encrypted at rest on servers and endpoints, and in transit?',
  ]),
  ...qGroup('C · Compliance & evidence', TEAL, [
    'How do you produce evidence for HIPAA, 42 CFR Part 2, CMIA, DMHC, and URAC today — and how much staff time does it consume?',
    'When was your most recent URAC re-accreditation review or DMHC compliance filing, and what IT evidence did it require?',
    'How are Business Associate Agreements (BAAs) tracked with vendors that touch PHI?',
    'Are substance-use-disorder (42 CFR Part 2) records segregated or specially controlled in your systems?',
  ]),
  ...qGroup('D · Operations & AI readiness', CHARTREUSE, [
    'Roughly what monthly volumes do you handle — member/crisis calls, EAP intakes, claims, and authorizations?',
    'Which systems run claims, utilization management, and the provider/member portals (e.g., QuickCap), and who supports them?',
    'Where does your staff spend the most repetitive manual time today?',
    'Are there service levels (call wait time, authorization turnaround, claims cycle) you are measured against?',
  ]),
  ...qGroup('E · Team, roadmap & decision', DARK_CHARCOAL, [
    'How many people are on your IT team, and what are their roles and after-hours coverage today?',
    'What IT or security projects are on your 2026 roadmap that you would like more bandwidth for?',
    'What does your budget cycle look like, and who besides you weighs in on a decision like this (finance, compliance, the CEO)?',
    'What would a successful partnership look like to you twelve months from now?',
  ]),
  spacer(80),
  calloutBox('You do not have to answer these on paper',
    'A free Nexus Assess answers most of Groups A and B with hard data — an internal and external vulnerability scan, a dark-web credential check, and a Microsoft 365 security review — returned as a prioritized roadmap mapped to HIPAA. The remaining questions take a short conversation. Either path turns this brief into a costed plan.', CORE_ORANGE),
];

// ============================================================
// SECTION 11 — PATH FORWARD
// ============================================================
const section11 = [
  ...sectionHeader('The Path Forward', CORE_BLUE, '11'),
  p('A low-commitment sequence that gives you something useful at every step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 48 }, { label: 'Your commitment', weight: 44 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'Discovery conversation — we walk your environment and priorities (the Section 10 questions).', 'A meeting. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'Free Nexus Assess — internal + external vulnerability scan, dark-web credential check, and Microsoft 365 review, returned as a prioritized roadmap mapped to HIPAA.', 'None. Free, and the roadmap is yours to keep.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Right-sized co-managed proposal — only the layers you want, scoped to your real environment, every line explained.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Your no-obligation next step',
    ['Book a free Nexus Assess. We return a prioritized, HIPAA-mapped roadmap within about ten business days — yours to keep whether or not we ever work together. No contract, no obligation.',
     'Contact: Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================
// ABOUT + APPENDIX
// ============================================================
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is a full-spectrum IT services company founded in 2000 by Ravi Jain. For more than 25 years we have served small and mid-sized organizations with managed and co-managed IT, cybersecurity, cloud, compliance frameworks (HIPAA, SOC 2, PCI, GDPR), and AI-driven development. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide 24/7 coverage at no additional cost. Our approach is cybersecurity-first and AI-forward — helping organizations use technology as a competitive advantage.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery center', bold: true }, 'Panchkula IT Park, Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];

const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. what we inferred'),
  p('In the spirit of the no-assumptions method, the following items were inferred from indirect evidence and should be confirmed with The Holman Group rather than treated as established fact:', { spaceAfter: 100 }),
  bullet('That the QuickCap name on the website corresponds to a specific claims/UM platform and how it is hosted — named on the site; vendor and deployment to confirm.'),
  bullet('The ~$7.2M revenue figure (from introductory notes, not independently confirmed) and the exact employee count.'),
  bullet('The mapping of 42 CFR Part 2 to specific Holman record sets — Part 2 governs SUD records generally; its precise application depends on your data and consent flows.'),
  bullet('All internal environment details (server/endpoint counts, security stack, M365 footprint, compliance evidence process) — these are deliberately left open for Section 10.'),
  bullet('The correct email domain for your team is holmangroup.com; the introduction listed a variant spelling. We will confirm addresses before any correspondence.'),
  subHeader('Selected sources'),
  ...[
    'The Holman Group — company story, services, provider & member portals: holmangroup.com; LinkedIn company page.',
    'HHS Office for Civil Rights — HIPAA Security Rule NPRM (Jan 2025) fact sheet: hhs.gov.',
    'SAMHSA / Federal Register — 42 CFR Part 2 final rule (2024; enforcement 2026): federalregister.gov.',
    'California DMHC — Knox-Keene Act & Regulations: dmhc.ca.gov. California CMIA — statutory penalties.',
    'URAC — Health Utilization Management / Health Network / CVO accreditation standards: urac.org.',
    'IBM — Cost of a Data Breach 2025 (healthcare): ibm.com; HIPAA Journal 2025 breach report.',
    'Comparitech — healthcare ransomware roundup H1 2025. Dark-web PHI valuation: Fierce Healthcare.',
    'McKinsey — generative AI in healthcare; McKinsey × Harvard $200–360B healthcare AI analysis.',
    'Cognizant — AI in health-claims processing. KFF — regulation of AI in prior authorization.',
    'CompTIA — managed services & the skills-gap thesis. vCISO / MDR / HIPAA cost ranges: SideChannel, UnderDefense, Expel, Secureframe, Velo, VC3.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider market, sourced above; figures specific to The Holman Group are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================
// HEADER / FOOTER / ASSEMBLE
// ============================================================
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)],
    borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
      new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'The Holman Group  ·  Co-Managed IT, Security & AI Strategy Brief', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });

const docFooter = new Footer({ children: [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 },
    children: [
      new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
      new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ] }),
] });

const allChildren = [
  ...cover, ...methodNote, ...toc, ...execSummary,
  ...section1, ...section2, ...section3, ...section4, ...section5,
  ...section6, ...section7, ...section8, ...section9, ...section10,
  ...section11, ...about, ...appendix,
];

const doc = new Document({
  creator: 'Technijian',
  title: 'The Holman Group — Co-Managed IT, Security & AI Strategy Brief',
  description: 'A facts-only pre-discovery brief for The Holman Group, prepared by Technijian.',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } },
    headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren,
  }],
});

const outPath = path.join(__dirname, 'HMG-CoManaged-IT-Security-AI-Brief.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); })
  .catch(err => { console.error('Failed:', err); process.exit(1); });
