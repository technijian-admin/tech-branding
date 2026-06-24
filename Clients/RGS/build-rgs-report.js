// ROG Services (RGS) — Managed & Co-Managed IT, Security & AI Strategy Brief
// Technijian-branded DOCX builder. FACTS-ONLY (cold inbound IT-discovery lead):
// report only verified public facts; assume nothing about their environment;
// turn every unknown into a client question. Authentic logo (assets/ root file).

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, TableOfContents
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
const TODAY = 'June 22, 2026';

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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
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
  centered('MANAGED & CO-MANAGED IT, SECURITY', { size: 26, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('& AI STRATEGY BRIEF', { size: 26, color: CORE_ORANGE, bold: true, after: 200 }),
  spacer(160),
  centered('ROG Services', { size: 54, color: DARK_CHARCOAL, bold: true, after: 60 }),
  centered('Resource Oversight & Guidance Services, Inc.', { size: 22, color: BRAND_GREY, bold: false, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: 'What we verified, where Technijian fits, and the questions that complete the picture', size: 23, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(1000),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('The Leadership of ROG Services Inc.', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · A PRE-DISCOVERY BRIEFING FOR ROG SERVICES', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================
// HOW TO READ THIS BRIEF + TOC
// ============================================================
const methodNote = [
  ...plainHeader('How to Read This Brief'),
  p('This document was prepared after a cold inbound inquiry and before any technical discovery. We have not spoken with your team about your environment, and we have not assumed anything about it. The brief deliberately does two things and nothing else:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports only verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about ROG Services is drawn from your public website and public filings (IRS Form 990, state records), and is cited in the Appendix. We have not assumed anything about your IT systems, security tooling, software, or compliance posture — your public site discloses none of it.' }]),
  bulletRuns([{ text: 'It turns every unknown into a question. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we do not guess — we ask. Section 10 is a structured questionnaire; your answers (or a free Nexus Assess) complete the analysis and unlock real, costed recommendations.' }]),
  p('Numbers describing the wider market, the regulatory framework, and the threat landscape are facts about that environment — sourced and labeled — not claims about ROG Services. Any figure specific to your organization is intentionally left open until discovery.', { spaceBefore: 60, spaceAfter: 120 }),
  calloutBox('A note on honesty',
    ['Technijian would rather under-claim and verify than over-claim and walk it back. Where the application of a rule to your organization is a genuine legal question — for example, whether HIPAA, GLBA, or the CCPA reach a representative-payee nonprofit — we say so plainly and recommend confirming with your counsel, rather than asserting it to manufacture urgency.',
     'You should expect the same discipline in every deliverable we produce for you.'], TEAL),
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
  p('ROG Services Inc. — legally Resource Oversight & Guidance Services, Inc. — is a California nonprofit that serves as an organizational Social Security and VA representative payee, managing benefits for adults who cannot manage their own funds. You reached out to Technijian about IT; this brief responds on two fronts, then hands the specifics back to you.', { spaceAfter: 110 }),
  kpiRow([
    { number: '2,100+', label: 'Clients whose benefits ROG manages (ROG-reported)', color: CORE_BLUE },
    { number: '7', label: 'Offices across California & Montana', color: TEAL },
    { number: '$2.77B', label: '2024 BEC / payment-diversion losses (FBI IC3)', color: CRITICAL },
    { number: '$3.31M', label: 'Avg. breach cost, orgs under 500 staff (IBM 2025)', color: CORE_ORANGE },
  ]),
  spacer(90),
  pRuns([
    { text: 'Front one — protect and run IT well. ', bold: true, color: DARK_CHARCOAL },
    { text: 'As a representative payee you hold Social Security numbers, bank details, and health information, and you disburse benefit funds — including loading prepaid debit cards — for a vulnerable population across seven offices. That mix of sensitive data and money movement is what raises the security bar, and the Social Security Administration expressly asks payees to keep documented procedures that protect personal information. Technijian can run or co-manage that IT and security so a small team does not carry it alone.' },
  ], { spaceAfter: 100 }),
  pRuns([
    { text: 'Front two — integrate AI for efficiency. ', bold: true, color: DARK_CHARCOAL },
    { text: 'The work a payee repeats every month — preparing annual SSA and VA accountings, reconciling per-beneficiary ledgers, processing intake — is exactly where AI assists your staff, with the guardrail that this data belongs to vulnerable people and never goes near a public AI tool.' },
  ], { spaceAfter: 100 }),
  calloutBox('The single idea to carry into the meeting',
    'You protect some of the most vulnerable people in the benefits system, and you move their money. Technijian helps you protect them and their data — whether we run your IT or augment whoever supports you today — and we right-size it to a nonprofit budget. You will not find an invented price or guessed ROI here: nothing is assumed, and the questions in Section 10 are how this becomes a costed plan.', CORE_ORANGE),
];

// ============================================================
// SECTION 01 — WHAT WE VERIFIED
// ============================================================
const section1 = [
  ...sectionHeader('What We Verified About ROG Services', CORE_BLUE, '01'),
  p('Everything in this section is drawn from ROG Services’ own website, IRS Form 990 filings, and public state records. Sources are listed in the Appendix. Where the public record is a single source or a self-reported figure, we say so.', { spaceAfter: 140 }),
  subHeader('Organization snapshot'),
  buildTable(
    [{ label: 'Attribute', weight: 28 }, { label: 'Verified fact', weight: 72 }],
    [
      [{ text: 'What you do', bold: true }, 'Organizational representative payee — you receive and manage Social Security, SSI, and VA benefits on behalf of beneficiaries who cannot manage their own funds, and you act as a VA fiduciary.'],
      [{ text: 'Mission (verbatim)', bold: true }, '“Managing Benefits in a professional and caring manner for individuals struggling with mental illness.”'],
      [{ text: 'Legal entity', bold: true }, 'Resource Oversight & Guidance Services, Inc. — a California nonprofit public-benefit corporation; 501(c)(3) since November 2010 (organization started January 2010). EIN 27-1997250.'],
      [{ text: 'Who you serve', bold: true }, 'Adults on SSA/VA benefits who are unable to manage them — your site names severe mental illness, cognitive disabilities, and neurodegenerative conditions such as Alzheimer’s.'],
      [{ text: 'Footprint', bold: true }, 'Seven offices, “by appointment only”: Orange (HQ), Ontario, Escondido, Los Angeles, Santa Cruz, and Redwood City (CA), plus Missoula, Montana.'],
      [{ text: 'Leadership', bold: true }, 'Dean M. Reyburn, President/CEO (per public filings). Officers on record include a Vice President, Secretary, and Treasurer. (We do not assume who we will meet with.)'],
      [{ text: 'Scale', bold: true }, 'ROG reports “over 2,100 active clients” (its own figure). Public filings show FY2025 revenue of roughly $1.66M, up about 2.4× since 2021, with most revenue from payee fees. Staff size is in the 11–50 band (LinkedIn; unverified).'],
      [{ text: 'Recognition', bold: true }, 'Charity Navigator Four-Star (90%); BBB rating A+.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What your services tell us you must run'),
  p('Your public site does not name any software, portal, or IT system — so we assume none. But the services you describe imply a set of operations any payee must run. We list them as observations to confirm, not as facts about your systems:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Service you describe (verified on your site)', weight: 38 }, { label: 'What it implies for IT & security (to confirm)', weight: 62 }],
    [
      ['Receiving & disbursing SSA/SSI/VA benefits into a bonded client trust account', 'A money-movement operation — bank connectivity, reconciliation, and strict controls over who can move funds.'],
      ['Remotely loading customized allowances onto prepaid Visa® debit cards', 'A payments workflow that is a known fraud target — any change to a load or account needs verification.'],
      ['Bill-pay on behalf of clients (utilities, insurance)', 'Recurring outbound payments and vendor data — more surface for payment-diversion fraud.'],
      ['Per-beneficiary budgeting, savings, and benefit records', 'A system of record holding SSNs, bank details, and benefit data for 2,100+ people — the asset most needing protection and backup.'],
      ['A website contact form that accepts document attachments', 'An intake channel that may receive sensitive documents — where they land and how they are secured is a question.'],
    ], { headerColor: TEAL }),
  spacer(120),
  calloutBox('What we have NOT assumed — and will confirm with you',
    ['We do not know, and have not guessed: who provides your IT today; whether you use Microsoft 365 or Google Workspace; your endpoint and server counts; how your seven offices connect; what software runs your per-beneficiary accounting, bill-pay, and card loading; your security tooling (MFA, EDR, email security); or your backup and recovery design.',
     'These are precisely the questions in Section 10. A free Nexus Assess answers most of them with hard data rather than conversation.'], CORE_ORANGE),
];

// ============================================================
// SECTION 02 — THE FIDUCIARY DUTY & ITS OBLIGATIONS
// ============================================================
const section2 = [
  ...sectionHeader('The Fiduciary Duty — and the Obligations It Carries', CORE_BLUE, '02'),
  p('A representative payee and VA fiduciary operates under specific federal rules. The facts below describe those rules; they are not claims about how ROG complies with them today. We separate the obligations that clearly apply from the genuine open questions that need your counsel, rather than asserting all of them to manufacture urgency.', { spaceAfter: 140 }),
  subHeader('Obligations that clearly apply'),
  buildTable(
    [{ label: 'Obligation', weight: 24 }, { label: 'What the rule requires', weight: 42 }, { label: 'IT / records implication', weight: 34 }],
    [
      [{ text: 'SSA annual accounting', bold: true, color: CORE_BLUE }, 'Organizational payees file a Representative Payee Report (Form SSA-623) at least yearly (20 CFR 404.2065).', 'Recurring, evidence-heavy reporting across every beneficiary — a natural automation target.'],
      [{ text: 'SSA recordkeeping', bold: true, color: CORE_BLUE }, 'Keep bank statements, canceled checks, and receipts and produce them on request; two-year retention (20 CFR 404.2035).', 'Secure, retrievable document storage with retention enforcement.'],
      [{ text: 'Per-beneficiary ledger', bold: true, color: CORE_BLUE }, 'Collective accounts must not commingle org funds and must keep a documented accounting of each beneficiary’s deposits, expenditures, and transfers (20 CFR 404.2045).', 'A protected, backed-up system of record per client.'],
      [{ text: 'VA accounting & separate accounts', bold: true, color: CORE_BLUE }, 'File VA Form 21P-4706b accountings; maintain a separate federally-insured account per VA beneficiary, no commingling (38 CFR 13.200, 13.280).', 'Account-level controls and audit-ready records.'],
      [{ text: 'SSA & VA oversight reviews', bold: true, color: CORE_BLUE }, 'SSA conducts periodic onsite reviews of organizational payees (often via state Protection & Advocacy systems); VA conducts field examinations and onsite reviews (38 CFR 13.120, 13.300).', 'Records must be produced on demand without a fire drill.'],
      [{ text: 'SSA data-safeguarding', bold: true, color: CORE_BLUE }, 'SSA directs payees to safeguard beneficiary PII (SSN, bank info, health records) with “documented procedures,” extend them to staff and contractors, and apply role-based access.', 'This is a real security expectation — MFA, access control, and written procedures.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Genuine open questions — confirm with counsel, do not assume'),
  p('Whether several broader privacy laws reach a representative-payee nonprofit is unsettled. We flag them honestly rather than asserting they apply:', { spaceAfter: 100 }),
  bulletRuns([{ text: 'HIPAA. ', bold: true, color: DARK_CHARCOAL }, { text: 'A payee/fiduciary is generally not a HIPAA “covered entity,” yet you clearly receive health information (clients’ mental illness and disability; helping obtain treatment). Whether HIPAA applies turns on whether you ever bill health claims electronically or act as a business associate. California’s CMIA may reach medical information regardless. An open question for your counsel.' }]),
  bulletRuns([{ text: 'GLBA / FTC Safeguards Rule. ', bold: true, color: DARK_CHARCOAL }, { text: 'Whether an organization that manages benefit funds qualifies as a “financial institution” under the FTC Safeguards Rule is unsettled. We do not assert that it applies.' }]),
  bulletRuns([{ text: 'CCPA / CPRA. ', bold: true, color: DARK_CHARCOAL }, { text: 'California’s privacy law applies to for-profit “businesses”; the Attorney General states it does not include nonprofits — so you are likely outside it, with narrow affiliate exceptions to confirm.' }]),
  bulletRuns([{ text: 'CA Professional Fiduciaries licensing. ', bold: true, color: DARK_CHARCOAL }, { text: 'Representative payees fall outside the state’s “professional fiduciary” licensing definition, and a 501(c)(3) is excluded — unless your staff also serve as court-appointed conservators, guardians, or trustees. A question only if you do that work.' }]),
  spacer(80),
  calloutBox('Why the distinction matters',
    'The honest reading is that your SSA and VA obligations are concrete and your data-safeguarding duty is real, while the broader privacy laws are open questions a careful advisor confirms rather than assumes. We design to the obligations that clearly apply, flag the rest for your counsel, and never use an uncertain rule as a scare tactic.', TEAL),
];

// ============================================================
// SECTION 03 — THREAT LANDSCAPE
// ============================================================
const section3 = [
  ...sectionHeader('The Threat Landscape for a Benefits Fiduciary', CORE_BLUE, '03'),
  p('The following are facts about the environment in which any nonprofit that moves money for vulnerable people operates. They are not statements about ROG’s defenses, which we have not assessed.', { spaceAfter: 130 }),
  kpiRow([
    { number: '$2.77B', label: 'BEC / payment-diversion losses, 2024 (FBI IC3)', color: CRITICAL },
    { number: '88%', label: 'of small-business breaches involve ransomware (Verizon DBIR 2025)', color: CORE_ORANGE },
    { number: '$4.89B', label: 'losses by victims 60+ in 2024 (FBI IC3 Elder Fraud)', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  subHeader('Why this profile is targeted'),
  bulletRuns([{ text: 'You move money — the #2 cybercrime by dollar loss. ', bold: true, color: DARK_CHARCOAL }, { text: 'Business email compromise cost victims $2.77 billion in 2024 (FBI IC3), and the FBI specifically warns that attackers redirect payments onto prepaid cards — a maneuver that maps directly onto a payee’s card-loading and disbursement workflow. A single spoofed “please change this account” email is the classic attack.' }]),
  bulletRuns([{ text: 'You serve the population fraudsters target most. ', bold: true, color: DARK_CHARCOAL }, { text: 'Americans 60+ reported $4.89 billion in losses to the FBI in 2024 (up 43%). The Government Accountability Office has found that beneficiaries served by organizational payees are “among the most vulnerable” to exploitation, and that program oversight is uneven. Protecting them is the mission; protecting their data is part of it.' }]),
  bulletRuns([{ text: 'Small and nonprofit does not mean overlooked. ', bold: true, color: DARK_CHARCOAL }, { text: '88% of breaches at organizations under ~1,000 staff involved ransomware or extortion (Verizon 2025), and the average breach at an organization under 500 employees runs about $3.31 million. Most incidents begin with a human click — 60% of breaches involve the human element, and the median time to fall for a phishing email is under a minute.' }]),
  subHeader('How these market facts map to your operation'),
  p('These are general statistics, not findings about ROG. We connect them to the operation your website describes only to show where the exposure would naturally sit for any payee — the specifics are a discovery question:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'What attackers exploit', weight: 32 }, { label: 'Why a benefits payee is naturally exposed', weight: 68 }],
    [
      ['Payment-change requests (BEC)', 'You disburse benefits, pay bills, and load prepaid cards — a spoofed “please change this account or card” email targets that exact workflow, which is why out-of-band verification matters.'],
      ['Stolen or phished credentials', 'Email is the front door to beneficiary records and banking; one reused or phished password can open it. MFA closes the most common path in.'],
      ['Ransomware on records', 'Your per-beneficiary ledgers and accounting are the operational heart — encrypting them would halt disbursements and reporting until recovery. Tested, immutable backups make that an inconvenience, not a crisis.'],
      ['Targeting of vulnerable people', 'Beneficiary SSNs and benefit data enable long-term identity and benefit fraud against the people least able to recover — which is why the duty of care is higher here.'],
    ], { headerColor: CORE_ORANGE }),
  spacer(100),
  calloutBox('The honest framing',
    'We do not raise this to alarm you — your team may already manage these risks well. We raise it because the floor for “good enough” security is objectively higher when you move benefit money and hold SSNs for vulnerable people, and because the cost of a single incident dwarfs the cost of continuous protection. The right next step is to measure your actual exposure, not to assume it.', TEAL),
];

// ============================================================
// SECTION 04 — MANAGED & CO-MANAGED MODEL
// ============================================================
const section4 = [
  ...sectionHeader('Managed or Co-Managed — How Technijian Fits', CORE_BLUE, '04'),
  p('We do not yet know who runs your IT today — an internal person, an outside provider, or no one in particular — so we offer two shapes and let you choose. In both, your organization keeps control of strategy and we add tooling, specialized skills, and around-the-clock coverage that a small multi-site nonprofit cannot staff on its own.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Model', weight: 24 }, { label: 'Best fit when…', weight: 32 }, { label: 'What Technijian provides', weight: 44 }],
    [
      [{ text: 'Fully managed IT', bold: true, color: CORE_BLUE }, 'No one really owns IT today, or it is handled informally between other duties.', 'We run day-to-day IT end-to-end: a help desk your staff can call, managed devices and Microsoft 365 across all offices, security, patching, and backup — one predictable monthly cost.'],
      [{ text: 'Co-managed IT', bold: true, color: CORE_ORANGE }, 'You already have an internal person or an outside shop you want to keep.', 'We augment them: 24/7 security monitoring, after-hours and weekend coverage, specialized tooling, and project bandwidth — they keep the roadmap; we fill the gaps.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What a small, multi-site team cannot staff alone'),
  p('This is not a comment on anyone’s capability — it is arithmetic. The items below require 24/7 staffing, specialized tooling, or dedicated bandwidth that a small nonprofit running seven offices cannot also provide:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Capability gap', weight: 32 }, { label: 'Why it needs a partner', weight: 68 }],
    [
      ['24/7 security monitoring & response', 'Attacks land after hours and on weekends. A small team is offline exactly when many incidents begin.'],
      ['Email & payment-fraud defense', 'Anti-phishing plus a verification process for account- and payment-change requests — the specific control that stops the wire-fraud aimed at fund-movers.'],
      ['Backup & rapid recovery', 'Immutable, tested backups of your accounting and beneficiary records, so a ransomware event is an inconvenience, not a catastrophe.'],
      ['Multi-office IT', 'Consistent, secure setup and support across seven locations and any remote staff — without a road trip for every issue.'],
      ['Audit-evidence support', 'Help producing the IT-side records an SSA or VA review expects, as a routine, not a scramble.'],
      ['Strategy & roadmap', 'A planning and budgeting cadence (a virtual CIO/CISO function) that an organization this size never staffs as a full-time role.'],
    ], { headerColor: CORE_ORANGE }),
  spacer(120),
  calloutBox('Said plainly',
    'Whether we run your IT or augment whoever does, you stay in control, you gain a named Technijian pod that learns your environment, and you get the 24/7 coverage, security, and backup a small team cannot sustain alone — right-sized to a nonprofit budget. On your worst week we are the bench you call; on a normal week you barely notice us.', CORE_BLUE),
];

// ============================================================
// SECTION 05 — CAPABILITY MAP
// ============================================================
const section5 = [
  ...sectionHeader('Technijian Capability Map', CORE_BLUE, '05'),
  p('Technijian is an Irvine-based IT services company founded in 2000, with a Panchkula, India delivery center for 24/7 follow-the-sun coverage. We are cybersecurity-first (CISSP-led, with our own Security Operations Center) and AI-forward (we build, not just resell). The table maps our service lines to the categories of need a multi-site benefits fiduciary typically has. Which of these apply to you is a discovery question, not an assumption.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Need category', weight: 30 }, { label: 'Technijian service', weight: 22 }, { label: 'What it delivers', weight: 48 }],
    [
      ['Managed / co-managed help desk & operations', { text: 'My IT', bold: true, color: CORE_BLUE }, 'Help desk, after-hours coverage, monitoring, patching, and Microsoft 365 administration across all seven offices — run for you or alongside your team.'],
      ['24/7 security monitoring & response', { text: 'My Security', bold: true, color: CORE_BLUE }, 'SOC, EDR/MDR, identity hardening, and incident response — the around-the-clock layer.'],
      ['Email & phishing defense', { text: 'My AntiSpam', bold: true, color: CORE_BLUE }, 'Managed email security (anti-phishing / anti-spam) at a published $4.75 per user per month — the front line against payment-diversion fraud.'],
      ['Compliance evidence & frameworks', { text: 'My Compliance', bold: true, color: CORE_BLUE }, 'Risk assessments, policy libraries, and audit-ready evidence; framework experience spanning HIPAA, SOC 2, PCI, and GDPR — applied to your SSA/VA safeguarding duties.'],
      ['Backup, continuity & DR', { text: 'My Continuity', bold: true, color: CORE_BLUE }, 'Immutable, tested backups of servers, accounting records, and Microsoft 365 with defined recovery objectives.'],
      ['Security visibility & reporting', { text: 'My Jian', bold: true, color: CORE_BLUE }, 'A Technijian-built platform that aggregates signals across your tools into a plain monthly security report.'],
      ['Practical AI & custom builds', { text: 'My AI / My Dev', bold: true, color: CORE_BLUE }, 'Document intelligence, workflow automation, and custom development — the efficiency front in Section 7.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('How we work — representative engagement profiles'),
  p('These are the shapes of work we deliver, anonymized and described by scope only — no client names and no cherry-picked outcome numbers:', { spaceAfter: 100 }),
  calloutBox('Profile A — Multi-site nonprofit, fully managed',
    'A nonprofit with several small offices and no full IT department. Scope: standardized and secured Microsoft 365 with nonprofit licensing, MFA for every user, managed and encrypted endpoints, and tested backups — so leadership could stop worrying about IT and focus on the mission.', CORE_BLUE),
  calloutBox('Profile B — Handles money and personal data',
    'An organization that disburses funds and holds sensitive personal data. Scope: email security and anti-phishing, identity hardening, and a verification process for any payment- or account-change request — the controls that stop wire-fraud and payment diversion.', CORE_ORANGE),
  calloutBox('Profile C — Records- and reporting-heavy operation',
    'An operation buried in recurring paperwork. Scope: AI document-intelligence and workflow automation explored to cut repetitive processing — the same pattern we would look at for annual accountings and per-client reporting, once the IT foundation is solid.', TEAL),
  subHeader('“Won’t AI cost a fortune?” — the multi-model discipline'),
  p('A fair question whenever AI is on the table. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three vendors and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume extraction and classification, mid-tier models for the bulk of reasoning and drafting, and frontier models reserved for the small slice that genuinely needs deep judgment. Where quality is non-negotiable, multiple models peer-review the same output. In practice this runs roughly 60–80% below the cost of routing everything to a single premium model, with no quality loss on the work that matters — and private, governed deployments mean sensitive beneficiary data never reaches a public tool.', { spaceAfter: 120 }),
];

// ============================================================
// SECTION 06 — SECURITY & COMPLIANCE ARCHITECTURE
// ============================================================
const section6 = [
  ...sectionHeader('Security & Records Architecture', CORE_BLUE, '06'),
  p('An organization that moves benefit money and holds SSNs has to cover six security layers, and be able to produce records when SSA or VA asks. Any one is buildable in-house; the difficulty is running all six continuously, across multiple offices, with documentation a reviewer will accept. The table describes what each layer covers and what it maps to — a structure we would tailor to your environment after discovery, never impose before it.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Layer', weight: 24 }, { label: 'What it covers', weight: 46 }, { label: 'Maps to', weight: 30 }],
    [
      [{ text: 'Identity & access', bold: true, color: CORE_BLUE }, 'MFA on every login, conditional access, and role-based access to beneficiary data. Most breaches begin at a stolen sign-in.', 'SSA PII safeguarding'],
      [{ text: 'Endpoints & devices', bold: true, color: CORE_BLUE }, 'EDR/threat detection on every laptop across all offices, disk encryption, enforced patching — on and off network.', 'SSA PII safeguarding'],
      [{ text: 'Email & payment fraud', bold: true, color: CORE_BLUE }, 'Anti-phishing, malicious-link protection, and a verification process for payment- and account-change requests.', 'BEC / fund-disbursement risk'],
      [{ text: 'Data, backup & ransomware', bold: true, color: CORE_BLUE }, 'Immutable, tested backups of beneficiary records and accounting systems; rapid, verified recovery.', 'SSA recordkeeping (20 CFR 404.2035)'],
      [{ text: 'Audit-ready records', bold: true, color: CORE_BLUE }, 'Records stored, retained, and retrievable on demand for an SSA onsite review or a VA field examination.', 'SSA / VA oversight reviews'],
      [{ text: '24/7 SOC & response', bold: true, color: CORE_BLUE }, 'Eyes-on-glass monitoring with a defined response — the around-the-clock coverage a small team cannot staff alone.', 'SSA PII safeguarding'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('The control that matters most for a fund-mover',
    'If we highlight one layer, it is email-and-payment-fraud defense. A representative payee’s daily reality — disbursing benefits, paying bills, loading prepaid cards — is exactly the workflow business email compromise targets. A simple, enforced rule (no payment or account change without out-of-band verification), backed by email security and MFA, stops the single most expensive attack in the FBI’s data.', CORE_ORANGE),
];

// ============================================================
// SECTION 07 — AI OPPORTUNITY
// ============================================================
const section7 = [
  ...sectionHeader('The AI Integration Opportunity', CORE_BLUE, '07'),
  p('The second front is efficiency. The work ROG repeats every month is exactly the kind of structured, document-heavy work where AI serves as an assistant to staff. The table pairs an operation a payee runs with the corresponding AI pattern and an honest note on the guardrail. Read these as opportunities to confirm against your real volumes — not as promises.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Operation a payee runs', weight: 28 }, { label: 'AI pattern (assistive)', weight: 40 }, { label: 'Guardrail / note', weight: 32 }],
    [
      ['Annual SSA & VA accountings (SSA-623, VA 21P-4706b)', 'Draft the recurring accountings from ledger data across many beneficiaries; staff review and sign.', 'High-volume, repetitive — a strong fit; human signs every filing.'],
      ['Per-beneficiary ledger reconciliation', 'Match deposits, disbursements, and bill payments; flag exceptions for a human.', 'AI flags; people decide. Data stays in a private, governed system.'],
      ['Intake & document handling', 'Extract and route information from intake paperwork and attachments.', 'No beneficiary PII in public AI tools — ever.'],
      ['Bill-pay & vendor matching', 'Read incoming bills, match to the right beneficiary and budget, queue for approval.', 'Payment release stays a human, verified step.'],
      ['Multi-office knowledge & onboarding', 'A private knowledge assistant so procedures and case history are consistent across offices.', 'Improves consistency; never replaces case judgment.'],
    ], { headerColor: TEAL }),
  spacer(120),
  pRuns([
    { text: 'The guardrail, stated first. ', bold: true, color: DARK_CHARCOAL },
    { text: 'This data belongs to vulnerable people. Every AI pattern above runs on private, governed deployments — never a public chatbot — with a human reviewing anything that affects a beneficiary’s money or record. AI here drafts, reconciles, and triages so your staff spend less time on repetitive paperwork and more on the people they serve. It never makes a payment or a benefit decision on its own.' },
  ], { spaceAfter: 120 }),
  pRuns([
    { text: 'Run as a managed investment, not a leap of faith. ', bold: true, color: DARK_CHARCOAL },
    { text: 'We would not switch on all five patterns at once. The disciplined approach — the way credible analysts such as McKinsey frame AI adoption — is to run one high-volume, low-risk workflow first, measure the staff hours it actually returns, and only then expand. The annual SSA and VA accountings are the obvious first candidate: they are repetitive, deadline-driven, and the same shape every year. If a pilot does not clear its cost at the gate, we tell you and we stop. That keeps the efficiency front honest, and it keeps it affordable for a nonprofit that has to account for every dollar.' },
  ], { spaceAfter: 120 }),
  calloutBox('How this stays honest',
    'We will not put a dollar of “AI savings” specific to ROG in writing until we know your real volumes — clients, monthly disbursements, accountings, intakes — and what software you run today. Those are questions in Section 10. The patterns above tell you the opportunity is real; only your data tells you its size.', CORE_ORANGE),
];

// ============================================================
// SECTION 08 — UNDERSTANDING AI (education layer)
// ============================================================
const section8 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '08'),
  p('A short, vendor-neutral primer so the conversation rests on shared ground rather than hype. Each point is anchored to an independent framework, not a sales claim.', { spaceAfter: 130 }),
  h3('What AI is — and the one distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction comes from Anthropic’s engineering guidance: ', }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a predefined path — predictable, low-risk, e.g. “draft this accounting from these ledger entries”) versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself — flexible, needs oversight). The operating principle is to use the simplest thing that works: start with simple automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer, so a human reviews anything that affects a beneficiary’s money or record.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— SSNs, bank details, and health information never go into public AI tools; we use private, governed deployments.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool is inventoried with an owner, vendor, and data source, straight from the NIST “Govern” function.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Do-it-yourself tools are cheap but leave you to assemble and govern the system — and to own the three risks above. A capable full-time AI hire costs well over $180,000 a year, is scarce, and cannot cover strategy, build, security, and governance alone. A partner provides all four at a fraction of the cost, with proven builds and CISSP-led security — which matters more, not less, when the data belongs to vulnerable people.', { spaceAfter: 120 }),
];

// ============================================================
// SECTION 09 — MARKET CONTEXT & INVESTMENT FRAMEWORK
// ============================================================
const section9 = [
  ...sectionHeader('Market Context & Investment Framework', CORE_BLUE, '09'),
  p('No price in this section is a quote for ROG Services. We lead with the nonprofit programs that lower your cost, then show market-typical ranges for context only. Your actual figure is scoped after a free Nexus Assess.', { spaceAfter: 140 }),
  subHeader('Cost levers we apply for a 501(c)(3) first'),
  buildTable(
    [{ label: 'Program', weight: 28 }, { label: 'What it provides (2026)', weight: 44 }, { label: 'Note', weight: 28 }],
    [
      ['Microsoft 365 Nonprofit', 'Business Basic granted free (to 300 users); Business Premium — the security tier with Defender, device management, and conditional access — at about $5.50/user/mo (deeply discounted).', 'Since July 2025 the free Premium grant ended; the discount remains.'],
      ['TechSoup', 'Donated/discounted software and hardware for 501(c)(3)s — often up to ~90% off retail.', 'Eligibility: 501(c)(3).'],
      ['Google Workspace for Nonprofits', 'Free for eligible nonprofits (to 2,000 users); advanced security via a discounted upgrade.', 'If you run Google rather than Microsoft.'],
      ['Azure / cloud credits & at-risk-org programs', 'Microsoft Azure nonprofit credit; Cloudflare and identity programs with free tiers for eligible nonprofits.', 'Applied where you are eligible.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Market-typical ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Service line', weight: 36 }, { label: 'Market-typical range (2026)', weight: 36 }, { label: 'Note', weight: 28 }],
    [
      ['Managed / co-managed IT (per user / month)', '$110–$400; small organizations toward the lower-to-middle of that band', 'Scales with users & scope'],
      ['24/7 SOC / managed detection & response', '$10–$30 / endpoint / mo; small orgs often $1,500–$5,000 / mo', 'Directional'],
      ['Email security', '~$3–$6 / user / mo (Technijian My AntiSpam $4.75 in-band)', 'Directional'],
      ['Microsoft 365 / cloud backup', '~$3–$7 / user / mo', 'Directional'],
      ['Security-awareness training', '~$1–$5 / user / mo', 'Directional'],
      ['Virtual CIO / CISO (strategy)', '$3,000–$12,000 / mo at market; right-sized far lower for a small org', 'Versus a $270K+/yr full-time hire'],
    ], { headerColor: TEAL }),
  spacer(120),
  pRuns([
    { text: 'The consolidation argument. ', bold: true, color: DARK_CHARCOAL },
    { text: 'For a small multi-site nonprofit, the value is one team and one bill covering IT, security, backup, and strategy instead of a patchwork of point tools and ad-hoc help — with nonprofit licensing applied wherever you are eligible. The reason Technijian can deliver this affordably is a senior U.S.-led, India-delivered model, presented as one blended rate rather than a stack of line items.' },
  ], { spaceAfter: 120 }),
  calloutBox('How a real number gets set',
    'We quote from data, not assumptions. A free Nexus Assess inventories your environment; from there we build a fixed, per-line proposal covering only the layers you want, with nonprofit Microsoft 365 licensing and other 501(c)(3) programs applied where eligible. Every line is explained; nothing is hidden.', TEAL),
];

// ============================================================
// SECTION 10 — QUESTIONS TO COMPLETE THE ANALYSIS
// ============================================================
function qGroup(title, color, items) {
  return [subHeader(title, { color }), ...items.map(q => bullet(q))];
}
const section10 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '10'),
  p('This is the heart of the brief. Everything above is what we could verify or source; the analysis becomes real and costed only when these are answered — by your team, or by a free Nexus Assess that measures many of them directly. There are no wrong answers, and “we’re not sure” is useful information.', { spaceAfter: 130 }),
  ...qGroup('A · IT environment & your seven offices', CORE_BLUE, [
    'Who provides your IT today — an internal staff member, an outside provider, or handled informally? What works and what doesn’t?',
    'Are you on Microsoft 365, Google Workspace, or something else — and which plan?',
    'Of the seven offices, which are staffed day-to-day, and how do staff there connect and share files? Do people work remotely?',
    'Roughly how many computers/laptops and users are there in total, and what operating systems (any older Windows)?',
    'Do you run any on-premises servers, or is everything cloud/SaaS?',
    'How are devices and data backed up today, and when was the last successful test restore?',
  ]),
  ...qGroup('B · Security & fraud prevention', CORE_ORANGE, [
    'Is multi-factor authentication required for everyone, including email and remote access?',
    'What endpoint protection / antivirus and email-security products are in place today?',
    'What is your process when someone requests a change to a payment, a bank account, or a prepaid-card load — is there an out-of-band verification step?',
    'Who watches for security alerts, and what happens after hours or on weekends?',
    'Have you had a security assessment or vulnerability scan, and is data encrypted on laptops and servers?',
    'Do you have written security procedures (the documented PII safeguards SSA expects), and a basic incident-response plan?',
  ]),
  ...qGroup('C · Fiduciary records & audit-readiness', TEAL, [
    'What software runs your per-beneficiary accounting, bill-pay, and prepaid-card loading — a dedicated payee platform, QuickBooks, spreadsheets, or a mix?',
    'How and where are benefit records, bank statements, and receipts stored, and how is the two-year retention handled?',
    'How do you produce records today for an SSA Protection-and-Advocacy onsite review or a VA field examination — and how much staff time does it take?',
    'Do you handle any health information that might raise HIPAA or California CMIA questions worth confirming with counsel?',
  ]),
  ...qGroup('D · Operations & AI readiness', CHARTREUSE, [
    'Roughly what monthly volumes do you handle — active clients, disbursements, intakes, bill payments?',
    'Where does your staff spend the most repetitive manual time — annual accountings, reconciliation, intake paperwork?',
    'How many annual SSA/VA accountings do you prepare in a year, and how is that work done today?',
    'Are there service expectations (response time to clients, disbursement turnaround) you hold yourselves to?',
  ]),
  ...qGroup('E · Team, roadmap & decision', DARK_CHARCOAL, [
    'Who, besides the person we’re speaking with, weighs in on an IT decision — the board, finance, the CEO?',
    'What prompted you to reach out now — a specific problem, a growth plan, a board ask?',
    'What IT or security projects are on your mind for the next year that you’d like more bandwidth for?',
    'What would a successful partnership look like to you twelve months from now?',
  ]),
  spacer(80),
  calloutBox('You do not have to answer these on paper',
    'A free Nexus Assess answers many of Groups A and B with hard data — an internal and external vulnerability scan, a dark-web credential check, and a Microsoft 365 / Google Workspace security review, returned as a prioritized roadmap mapped to your SSA/VA safeguarding duties. The remaining questions take a short conversation. Either path turns this brief into a costed plan.', CORE_ORANGE),
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
      [{ text: '2', bold: true, color: CORE_BLUE }, 'Free Nexus Assess — internal + external vulnerability scan, dark-web credential check, and Microsoft 365 / Google Workspace review, returned as a prioritized roadmap mapped to your SSA/VA safeguarding duties.', 'None. Free, and the roadmap is yours to keep.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Right-sized proposal — managed or co-managed, only the layers you want, scoped to your real environment with nonprofit licensing applied, every line explained.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Your no-obligation next step',
    ['Book a free Nexus Assess. We return a prioritized, safeguarding-mapped roadmap within about ten business days — yours to keep whether or not we ever work together. No contract, no obligation.',
     'Contact: Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================
// ABOUT + APPENDIX
// ============================================================
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is a full-spectrum IT services company founded in 2000 by Ravi Jain. For more than 25 years we have served small and mid-sized organizations — businesses and nonprofits — with managed and co-managed IT, cybersecurity, cloud, compliance frameworks (HIPAA, SOC 2, PCI, GDPR), and AI-driven development. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide 24/7 coverage at no additional cost. Our approach is cybersecurity-first and AI-forward — helping organizations use technology as a solution.', { spaceAfter: 140 }),
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
  p('In the spirit of the no-assumptions method, the following were inferred from indirect evidence and should be confirmed with ROG Services rather than treated as established fact:', { spaceAfter: 100 }),
  bullet('All internal IT details — who supports IT, Microsoft 365 vs Google, endpoint/server counts, how offices connect, security tooling, and backup design — are deliberately left open for Section 10. Your public site discloses none of them.'),
  bullet('The software running your per-beneficiary accounting, bill-pay, and prepaid-card loading is unknown; the operations in Section 1 are inferred from the services you describe, not from any named system.'),
  bullet('The “over 2,100 active clients” figure and staff-size band are ROG’s own/third-party reported numbers, not independently audited.'),
  bullet('Whether HIPAA, GLBA/FTC Safeguards, or the CCPA apply to ROG are genuine legal questions for your counsel — Section 2 flags them rather than asserting them.'),
  bullet('Your public site is rogservices.org while the published contact email uses rogservices.com (the .com redirects to .org); we will confirm the correct address before any correspondence.'),
  subHeader('Selected sources'),
  ...[
    'ROG Services — services, programs, offices, contact: rogservices.org (Home, Rep Payee Services, Types of Assistance, Contact).',
    'IRS Form 990 / nonprofit records: ProPublica Nonprofit Explorer, Charity Navigator, GuideStar/Candid, BBB (EIN 27-1997250); California Secretary of State.',
    'SSA Representative Payee Program: ssa.gov/payee (forms, accounting FAQ, PII safeguarding, Protection & Advocacy reviews); 20 CFR 404.2035, 404.2045, 404.2065; POMS GN 00603.020.',
    'VA Fiduciary Program: va.gov forms 21P-4706b/c; 38 CFR Part 13 (13.120, 13.200, 13.280, 13.300); VA Fiduciary Program Guide (2025).',
    'Privacy questions: HHS HIPAA covered-entity / business-associate guidance; FTC Safeguards Rule (16 CFR 314); California AG CCPA guidance; California CMIA (Civ. Code §56). CA Professional Fiduciaries Act (BPC §6500 et seq.).',
    'Threat landscape: FBI IC3 Internet Crime Report 2024 and Elder Fraud Report 2024; FBI IC3 BEC PSA (2024); Verizon 2025 Data Breach Investigations Report; IBM Cost of a Data Breach 2025; GAO-19-688; SSA OIG reports.',
    'Nonprofit IT programs: Microsoft 365 nonprofit plans & eligibility (microsoft.com/nonprofits); TechSoup; Google for Nonprofits; Cloudflare Project Galileo; Okta for Good.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and regulatory figures are facts about the wider environment, sourced above; figures specific to ROG Services are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'ROG Services  ·  Managed & Co-Managed IT, Security & AI Strategy Brief', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  title: 'ROG Services — Managed & Co-Managed IT, Security & AI Strategy Brief',
  description: 'A facts-only pre-discovery brief for ROG Services, prepared by Technijian.',
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

const outPath = path.join(__dirname, 'RGS-CoManaged-IT-Security-AI-Brief.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); })
  .catch(err => { console.error('Failed:', err); process.exit(1); });
