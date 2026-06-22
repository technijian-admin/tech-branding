// ROG Services (RGS) — Executive Summary (forwardable hook artifact)
// Distilled from the full brief. FACTS-ONLY. Authentic logo. Reuses report helpers.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber
} = require('C:/vscode/tech-branding/tech-branding/node_modules/docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL = strip(tokens.color.status.critical.$value);
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 22, 2026';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(size = 200) { return new Paragraph({ keepNext: true, spacing: { before: size, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 130 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 318 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function pRuns(runs, opts = {}) {
  const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 130 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 318 },
    children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) });
}
function subHeader(text, color = CORE_BLUE) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size: 26, bold: true, color, font: FONT_HEAD })] });
}
const NUM_BULLETS = 'b';
function bullet(text) { return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 30, after: 70, line: 296 }, children: [new TextRun({ text, size: 21, color: BRAND_GREY, font: FONT_BODY })] }); }
function bulletRuns(runs) { return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 30, after: 70, line: 296 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 21, color: r.color || BRAND_GREY, bold: r.bold || false, font: FONT_BODY })) }); }
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 70 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 50, line: 296 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 150, bottom: 150, left: 230, right: 190 }, children: [titleP, ...bodyParas] }),
    ] })] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 180, bottom: 180, left: 90, right: 90 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: it.number, size: 40, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
    ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, headerColor = CORE_BLUE) {
  const totalW = columns.reduce((s, c) => s + c.weight, 0);
  const colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalW)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 120, right: 120 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text: c.label, size: 18, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, verticalAlign: VerticalAlign.TOP,
      children: [new Paragraph({ spacing: { line: 272, after: 20 }, children: [new TextRun({ text: cellObj.text, size: 18, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ tableHeader: true, children: headerCells }), ...dataRows] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, opts = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = opts; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }

// ---------- CONTENT ----------
const children = [
  colorBar(CORE_BLUE, 130),
  spacer(220),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 250, height: Math.round(250 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(200),
  centered('EXECUTIVE SUMMARY', { size: 22, color: CORE_ORANGE, bold: true, after: 90 }),
  centered('ROG Services', { size: 42, color: DARK_CHARCOAL, bold: true, after: 40 }),
  centered('Resource Oversight & Guidance Services, Inc.', { size: 19, color: BRAND_GREY, bold: false, after: 80 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Managed & Co-Managed IT, Security & AI — what we verified, and the questions that complete the picture', size: 21, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 180 }, children: [new TextRun({ text: 'Prepared for the leadership of ROG Services  ·  ' + TODAY + '  ·  Confidential', size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '2,100+', label: 'Clients ROG manages (ROG-reported)', color: CORE_BLUE },
    { number: '7', label: 'Offices · California & Montana', color: TEAL },
    { number: '$2.77B', label: '2024 BEC losses (FBI IC3)', color: CRITICAL },
    { number: '$3.31M', label: 'Avg. breach, orgs <500 staff (IBM)', color: CORE_ORANGE },
  ]),
  spacer(160),
  p('ROG Services Inc. — Resource Oversight & Guidance Services — is a California nonprofit that serves as a Social Security and VA representative payee, managing benefits for adults who cannot manage their own funds. You reached out to Technijian about IT. This summary makes the case on two fronts and hands the specifics back to you — it states only verified public facts and defers every organization-specific number to discovery.', { spaceAfter: 120 }),
  pRuns([{ text: 'Protect & run IT well. ', bold: true, color: DARK_CHARCOAL }, { text: 'You hold SSNs, bank details, and health information, and you disburse benefit funds — including loading prepaid cards — for vulnerable people across seven offices. That mix of sensitive data and money movement raises the bar, and SSA expressly asks payees to keep documented procedures protecting personal information.' }, { text: '  Integrate AI. ', bold: true, color: DARK_CHARCOAL }, { text: 'The annual SSA/VA accountings, ledger reconciliation, and intake your staff repeat are where AI assists — never near a public tool, and never deciding on its own.' }], { spaceAfter: 60 }),

  subHeader('What we verified'),
  bulletRuns([{ text: 'Who you are: ', bold: true, color: DARK_CHARCOAL }, { text: 'a 501(c)(3) since 2010 (EIN 27-1997250), organizational SSA & VA representative payee, seven offices across California and Montana, Charity Navigator Four-Star, reporting “over 2,100 active clients.”' }]),
  bulletRuns([{ text: 'What you do: ', bold: true, color: DARK_CHARCOAL }, { text: 'receive and disburse benefits into a bonded trust account, load customized allowances onto prepaid Visa® debit cards, pay clients’ bills, and keep per-beneficiary records — a money-movement operation holding highly sensitive data.' }]),
  bulletRuns([{ text: 'What you must run: ', bold: true, color: DARK_CHARCOAL }, { text: 'annual SSA (SSA-623) and VA (21P-4706b) accountings, two-year record retention, per-beneficiary ledgers, and records producible for SSA and VA reviews.' }]),
  calloutBox('What we did NOT assume', 'Your public site discloses no IT details, so we have guessed none — not who supports your IT, Microsoft 365 vs Google, endpoint counts, security tooling, or backup design. Those are open questions in the full brief, answered by your team or a free Nexus Assess.', CORE_ORANGE),

  subHeader('Why it matters now'),
  buildTable(
    [{ label: 'Driver', weight: 30 }, { label: 'Why it raises the bar', weight: 70 }],
    [
      [{ text: 'You move money', bold: true, color: CORE_BLUE }, 'Business email compromise — redirecting payments, often onto prepaid cards — was the #2 cybercrime by dollar loss in 2024 ($2.77B, FBI IC3). It targets the exact workflow a payee runs.'],
      [{ text: 'SSA safeguarding duty', bold: true, color: CORE_BLUE }, 'SSA asks payees to keep documented procedures protecting beneficiary PII and to apply role-based access — a real expectation, not our opinion.'],
      [{ text: 'A targeted population', bold: true, color: CORE_BLUE }, 'Americans 60+ reported $4.89B in losses to the FBI in 2024; GAO calls organizational-payee beneficiaries “among the most vulnerable.”'],
      [{ text: 'Honest open questions', bold: true, color: CORE_BLUE }, 'Whether HIPAA, GLBA, or the CCPA reach a payee nonprofit are genuine legal questions — we flag them for your counsel rather than asserting them.'],
    ], CORE_BLUE),
  spacer(120),

  subHeader('What a partnership looks like — and what it costs'),
  pRuns([{ text: 'Managed or co-managed — your call. ', bold: true, color: DARK_CHARCOAL }, { text: 'If no one really owns IT today, we run it; if you have an internal person or outside shop, we augment them. Either way you keep control and gain a named, security-first Technijian pod plus the 24/7 monitoring, email- and payment-fraud defense, backup, and audit-evidence support a small multi-site team cannot sustain alone. On the AI side, we apply assistive automation to the work you already repeat — kept in private, governed deployments.' }], { spaceAfter: 100 }),
  pRuns([{ text: 'Nonprofit-first, no invented numbers. ', bold: true, color: DARK_CHARCOAL }, { text: 'We lead with the programs that lower your cost — Microsoft 365 nonprofit (the Business Premium security tier at about $5.50/user/mo), TechSoup, and other 501(c)(3) offers — then apply market-typical ranges only for context, never as a quote. Your real figure is scoped after a free assessment.' }], { spaceAfter: 60 }),

  subHeader('The next step — yours to keep'),
  p('Book a free Nexus Assess: an internal and external vulnerability scan, a dark-web credential check, and a Microsoft 365 / Google Workspace security review, returned as a prioritized roadmap mapped to your SSA/VA safeguarding duties within about ten business days — yours to keep, no contract, no obligation. It answers most of the open questions with hard data and turns this summary into a costed plan.', { spaceAfter: 110 }),
  calloutBox('Want the detail?', ['The full brief expands every point above and ends with a structured questionnaire — “Questions to Complete the Analysis” — covering your environment, security, fiduciary records, operations, and roadmap. Answer those, or let the assessment measure them.', 'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  949.379.8499  ·  technijian.com  ·  technology as a solution'], CORE_BLUE),
];

const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)],
    borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 124, height: Math.round(124 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
      new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'ROG Services  ·  Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const doc = new Document({
  creator: 'Technijian', title: 'ROG Services — Executive Summary', description: 'Forwardable executive summary for ROG Services, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [{ id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 230 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1700, right: MARGIN, bottom: 1320, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children }],
});
const outPath = path.join(__dirname, 'RGS-Executive-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
