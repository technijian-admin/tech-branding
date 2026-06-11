// Acuity Advisors (acuityadvisors.com) - AI Growth & Integration Strategy
// Technijian-branded DOCX report builder, built to the technijian-biz-dev-blueprint skill at RKE caliber
// (17 sections, 7 personas, 5 capability proofs, 6 diagrams). Warm EXPANSION of an existing managed-IT +
// cybersecurity relationship. ABM / professional-services GTM. AUTHENTIC logo. IT in place + real published
// rates + "TBD - discovery" (no invented pricing). Built-vs-service capability labels.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ---------- Brand constants ----------
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE     = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE   = strip(tokens.color.primary.orange.$value);
const TEAL          = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';
const PURPLE        = '7B2D8B';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

// AUTHENTIC logo (NOT the AI-fake set in assets/logos/png/technijian-logo-*).
const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_SERVICES_BUF = dbuf('services.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-02';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) { return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, pageBreakBefore: true, spacing: { before: 0, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}
function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 280, after: 120 }, children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })] });
}
const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })] });
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 80, right: 80 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 38, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}
function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function personaCard(name, color, fields) {
  const headerRow = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 120, bottom: 120, left: 200, right: 200 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })] })] });
  const fieldRows = fields.map(([label, value], i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], rows: [headerRow, ...fieldRows] });
}
function capabilityBox(title, built, applies, kind = 'built') {
  const leadLabel = kind === 'service' ? 'The Technijian Service: ' : 'What Technijian Built: ';
  const leadColor = kind === 'service' ? TEAL : CORE_BLUE;
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: leadColor, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: leadLabel, size: 20, bold: true, color: leadColor, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Acuity: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ] }),
    ]})],
  });
}
function diagramImage(buf, altTitle, widthPx = 600, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) }, altText: { title: altTitle, description: altTitle, name: altTitle } })] });
}
function diagramCaption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}

function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 168, height: 35 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
    new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  ] })] });
}

// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 264, height: 55 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ACUITY ADVISORS', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'M&A  ·  ESOP  ·  Valuation Advisory  —  Santa Ana, California', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Santa Ana, California  |  acuityadvisors.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for Acuity Advisors', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }));

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1989', label: 'Advising Since', color: CORE_BLUE },
    { number: 'West Coast', label: 'Largest ESOP Practice', color: CORE_ORANGE },
    { number: 'M&S', label: 'Platform-Backed (2024)', color: TEAL },
    { number: 'CFA·ASA', label: 'Credentialed Team', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Technijian already runs Acuity’s technology and security — the managed-IT stack, CrowdStrike and Huntress endpoint defense, Cisco Umbrella and INKY email and DNS protection, Veeam backups, and the Microsoft 365 hardening a confidential advisory firm depends on. This strategy is the next layer on that foundation: turning a relationship built on trust and security into a growth engine — quietly, and inside the perimeter we already protect. For an M&A and ESOP firm, security is not a feature; it is the precondition for using AI at all.'),
  p('Acuity has spent thirty-five years earning the hard things. Founded in 1989 as Strategic Equity Group and rebranded in 2021, the firm holds a CFA- and ASA-credentialed team, the largest ESOP advisory practice on the West Coast, a national platform behind it in Marshall & Stevens (which acquired the firm in September 2024), and a track record spanning ESOPs, sell-side and buy-side M&A, and valuation. The firm’s securities work runs through an affiliated FINRA broker-dealer, Edgewater Capital. What Acuity has not yet done is make that authority visible where business owners now begin — online, in search, and increasingly in the answers AI assistants give.'),
  p('The gap is precise and wide open. Owners researching "what is an ESOP," "should I sell or do an ESOP," and "how to sell my business in California" find accounting firms and a nonprofit, not the deal advisors. No competitor in the category — not the national leaders, not the regional content firms — has claimed the answer-engine position. Acuity, uniquely doing both M&A and ESOP, is the natural authority on the very decision owners agonize over, and it is the firm best positioned to own the local Southern California lower-middle-market lane that brokers and law firms hold today.'),
  p('The program runs three motions, all account-based and all respectful of how this firm actually wins work. Get cited: own the owner-education and decision content that earns authority and warm inquiries. Win the referral and the owner: intelligence on the CPAs, attorneys, and wealth advisors who send deals, and on owners showing transition signals. Run leaner and remember: secure, in-perimeter AI that speeds deal preparation and captures thirty-five years of institutional knowledge. Throughout, one boundary holds — AI assists the credentialed professional who signs, and confidential deal data never touches public AI.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Own the answer no one has claimed: the entire category is answer-engine-blind. The owner-education and "M&A vs. ESOP vs. family" decisions owners research first are unowned by the deal banks — and Acuity, uniquely doing both M&A and ESOP, is the natural authority.',
      'Turn thirty-five years into a visible, searchable asset: a credential-heavy, Marshall & Stevens-backed, West-Coast-leading ESOP practice whose proof is real but un-merchandised — no dated content cadence, no decision hub, no published track record.',
      'Build AI where it is safe to build it: because Technijian already secures Acuity’s perimeter, the deal-preparation and knowledge AI lives inside it — not in a public chatbot. That confidentiality boundary is the differentiator, not a limitation.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Acuity’s internal numbers (engagements per year, average fees, referral mix, pipeline) were not part of this draft. Every projection below is labeled estimated, pricing shows real published rates where they exist and "to be determined in discovery" everywhere else, and the return is shown as the method we will measure — not an invented multiple. The discovery questions in Section 15 replace estimates with real baselines.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 REGULATORY & CONFIDENTIALITY ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('The Regulatory & Confidentiality Architecture', DARK_CHARCOAL, '02'),
  spacer(100),
  p('Every growth plan for an M&A and ESOP firm has to start with the rules the work runs on, because here those rules are not a constraint to manage — they are the differentiator. The reason a careful, credentialed firm can pull ahead with AI is the same reason a reckless one cannot: confidentiality and defensible judgment are the product, and they are exactly what a secure, in-perimeter approach to AI protects. Acuity already lives inside a security perimeter Technijian runs; building AI inside it, rather than in a public tool, is the safe and credible path competitors cannot easily copy.'),
  spacer(140),
  buildTable(
    [ { label: 'Regime', weight: 2.3 }, { label: 'What It Requires', weight: 3.9 }, { label: 'The AI Boundary', weight: 3.8 } ],
    [
      ['Client confidentiality (M&A)', 'NDAs, blind "teasers," controlled data rooms; deal information is privileged and tightly held until release', 'Confidential deal data never touches public AI — a federal court has held public-AI documents are not privileged; AI runs in-perimeter only'],
      ['ESOP fiduciary duty (ERISA)', 'The trustee is an ERISA fiduciary; valuations must meet "adequate consideration"; valuation is the #1 ESOP litigation flashpoint under DOL scrutiny', 'AI prepares first-pass analysis; the credentialed appraiser independently verifies and signs the defensible valuation'],
      ['Valuation standards (USPAP)', 'The ASA credential mandates USPAP; rigor and defensibility under DOL examination', 'AI assists the spread and comps; it never generates the signed number — the human judgment is the product'],
      ['Securities / FINRA', 'Securities transactions run through the affiliated broker-dealer, Edgewater Capital (Member FINRA/SIPC), under its supervision', 'AI-assisted documents follow the firm’s existing review and supervision — Technijian has built exactly this inside a FINRA broker-dealer'],
      ['M&A broker exemption', 'A federal exemption covers M&A brokers for "eligible privately held companies" (under ~$25M EBITDA / ~$250M revenue); CA state rules and securities-sale deals still apply', 'A credibility and scope talking point — most of Acuity’s deals fit the band, but the process stays inside the firm’s compliance controls'],
      ['Marketing & content review', 'Outbound content from a securities-affiliated advisory firm needs compliance review before publication', 'AI drafts; compliance reviews and approves before anything is published — speed without shortcutting the control'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Boundary Is the Differentiator',
    [
      'The rule is simple and absolute: AI assists; the credentialed professional signs; confidential deal data never touches public AI. State it to clients and it becomes a trust signal, not a caveat.',
      'A confidential advisory firm cannot safely use the public-AI shortcut its less-careful peers reach for — which means the firm that builds AI safely, inside its perimeter, gains an advantage that is genuinely hard to copy.',
      'Technijian is uniquely placed to build it: we already run and secure Acuity’s environment, and we have delivered AI document intelligence inside a FINRA broker-dealer’s controls before. The compliance architecture and the security architecture are the same architecture.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 03 ACUITY SERVICE ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('Acuity’s Service Architecture', CORE_BLUE, '03'),
  spacer(100),
  p('Acuity is one of the few firms that advises the whole of an owner’s transition. Most boutiques pick a lane — sell-side M&A, or ESOPs, or valuation. Acuity runs all three, which is not just a broader menu; it is the structural reason the firm can advise the decision owners find hardest: whether to sell to a third party, sell to employees through an ESOP, or keep the business in the family. A firm that only does M&A will steer toward a sale; a firm that only does ESOPs will steer toward an ESOP. Acuity can advise the trade-off honestly — and that is a content and trust position only it can own.'),
  spacer(160),
  diagramImage(DIAGRAM_SERVICES_BUF, 'Acuity’s Three Practice Lines', 600, 1.61),
  diagramCaption('Figure 3.0 — Three practice lines spanning the owner’s whole transition: ESOP advisory, sell-side and buy-side M&A, and valuation'),
  spacer(120),
  subHeader('ESOP Advisory — the West Coast’s largest practice'),
  p('Acuity advises owners across the full ESOP lifecycle: a feasibility study to test whether an ESOP is the right path, plan design and financing structure, the Section 1042 tax-deferral election that lets a qualifying seller defer capital-gains tax, the senior-versus-seller debt structure, the trustee-side valuation the transaction stands on, and the ongoing sustainability, repurchase-obligation, and eventual second-stage resale. This is the deepest part of the firm’s moat — a credential-heavy practice in a category where the valuation is the single most litigated element and a defensible, independent number is the product.'),
  subHeader('M&A Advisory — sell-side and buy-side'),
  p('On the sell-side, Acuity runs the process owners cannot run themselves: valuation analysis, marketing materials and the confidential information memorandum, buyer screening, management presentations, and negotiation through close. On the buy-side, the firm identifies and evaluates targets, coordinates financing, executes, and supports post-closing integration. Because only a minority of businesses that go to market actually sell, the advisor’s judgment and process discipline are the difference between a closed deal and a wasted year — and that is exactly the work AI can accelerate without ever replacing.'),
  subHeader('Valuation Advisory — rigorous and defensible'),
  p('The valuation practice serves owners, CFOs, and boards across estate and gift planning, financial-reporting valuations (purchase-price allocation, impairment, and stock-based compensation), transaction and fairness opinions, and litigation support. It is the most recurring of the three relationships, and the one where credentials and defensibility matter most — a number that has to hold up under IRS, DOL, or court scrutiny.'),
  spacer(120),
  buildTable(
    [ { label: 'Practice Line', weight: 2.2 }, { label: 'Primary Buyer', weight: 2.8 }, { label: 'Where AI Helps (securely)', weight: 5 } ],
    [
      ['ESOP advisory', 'The legacy-minded owner', 'Feasibility modeling, decision-content authority, and first-pass trustee-valuation analysis the appraiser signs'],
      ['Sell-side M&A', 'The retiring founder', 'CIM and teaser first-drafts, buyer-list building, and proposal acceleration — in-perimeter'],
      ['Buy-side M&A', 'Strategic / PE acquirers', 'Target sourcing and screening, and diligence document review'],
      ['Valuation', 'CFOs and boards', 'Financial spreading and comps support, verified and signed by the credentialed professional'],
    ],
  ),
);

// ---------- 04 TRACK RECORD & EXPERIENCE ----------
docChildren.push(
  ...sectionHeader('Track Record & Experience Highlights', CORE_ORANGE, '04'),
  spacer(100),
  p('Acuity’s credibility is real and earned — and almost entirely uncaptured online. Thirty-five years, a senior team holding CFA, ASA, and ABV credentials, hundreds of ESOP transactions, and a national valuation platform behind it. The case studies below are a sample of the firm’s named work; the firm does not publish an aggregate deal count or value, which is itself part of the opportunity — the proof exists but is not merchandised where owners and referral sources can see it.'),
  spacer(140),
  subHeader('The Credentialed Team'),
  p('The firm is led by founder and Managing Director Christopher A. Kramer (CFA, ASA), who began his valuation career at Marshall & Stevens more than three decades ago — a notable detail given M&S’s 2024 acquisition of Acuity. The senior team includes Michael Perez (ASA, ABV, CFA), Chase Hoover (CFA), David Burdette, and Michael Young (CFA), among roughly eighteen professionals. This depth of credentials — the ASA mandating USPAP, the ABV favored for tax and IRS work, the CFA for financial rigor — is the firm’s defensibility, and it is exactly what makes the "AI assists, the credentialed professional signs" boundary both honest and easy to communicate.'),
  spacer(120),
  subHeader('Selected Transactions'),
  buildTable(
    [ { label: 'Company', weight: 2.6 }, { label: 'Type', weight: 2 }, { label: 'Note', weight: 3.4 } ],
    [
      ['R.F. MacDonald Co.', 'ESOP', 'Family business, ~300 employees — ownership transition to employees'],
      ['L&L Nursery Supply', 'Sale', 'Employee-owned distributor sold to a strategic buyer'],
      ['Computer Protection Technology', 'ESOP', 'Family-business ownership transition'],
      ['CMRE Financial Services', 'Sale', 'California C-corp sale after a prior failed go-to-market'],
      ['Rohl / House of Rohl', 'Sale', 'Acquired by Fortune Brands Home & Security (NYSE) — done under the Strategic Equity Group name'],
      ['Arborwell', 'ESOP + Sale', 'ESOP acquisition followed by a strategic sale'],
      ['Demcon (D&D Concrete)', 'ESOP', 'San Diego structural-concrete contractor — ESOP sale'],
      ['Bishamon Industries', 'ESOP', 'Owner retirement with real-property retention'],
    ],
  ),
  spacer(160),
  calloutBox(
    'A Real Asset, Un-Merchandised',
    [
      'Thirty-five years and hundreds of ESOP transactions are exactly the proof a prospective owner — and the CPA or attorney considering a referral — wants to see. Today it is not visible: no scoreboard, no published count, eight case studies under-surfaced.',
      'The Marshall & Stevens platform is a credibility and scale signal — national resources behind a senior, local team — and it too is barely surfaced.',
      'Merchandising this proof is among the cheapest, highest-return moves in the plan: the work is already done; it just needs to be made findable and provable.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE MARKET & THE SUCCESSION WAVE ----------
docChildren.push(
  ...sectionHeader('The Market & the Succession Wave', CORE_BLUE, '05'),
  spacer(100),
  p('Three forces converge in Acuity’s favor: a demographic wave of owners who must transition, a lower-middle-market that rewards the prepared, and a moment when both owners and AI engines decide credibility online. The demand is structural; the question is who owners — and the advisors who refer them — trust to guide it.'),
  spacer(140),
  subHeader('Market Forces (2025–2026)'),
  buildTable(
    [ { label: 'Force', weight: 2.5 }, { label: 'What’s Happening', weight: 4.1 }, { label: 'Implication for Acuity', weight: 3.4 } ],
    [
      ['The succession wave', 'About 2.9 million U.S. businesses are owned by people 55+; roughly 73% of owners plan a transition within a decade — a multi-trillion-dollar shift', 'Demand is structural and rising — the authority that earns the early conversation wins'],
      ['The planning gap', 'Only ~19% of boomer owners have started exit planning; only 20–30% of businesses that go to market actually sell', 'Acuity sells preparedness and execution into the gap — being found and trusted early is decisive'],
      ['ESOP tailwinds', '~6,600 ESOPs and $2T+ in assets; the WORK Act and 2025 legislation favor employee ownership; DOL valuation scrutiny remains high', 'The West Coast’s largest ESOP practice is positioned for the tailwind — defensible, credentialed valuation is the product'],
      ['Owners decide online first', 'Formal exit education rose 35%→68% and valuations 18%→60% (2013→2023); owners research "ESOP," "sell my business," and "valuation" before engaging', 'Education and answer-engine visibility are now how the relationship begins'],
      ['AI enters the deal room', 'M&A use of generative AI more than doubled to ~45% in 2025 (Bain); ~20% cost reduction (McKinsey) — but confidentiality limits the tools', 'The firms that adopt secure, in-perimeter AI pull ahead; the public-tool shortcut is closed to a confidential practice'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Market’s Verdict',
    [
      'The advisor owners trust is increasingly the one they (and their CPA) find and read first — which makes answer-engine authority a competitive asset, not a marketing nicety.',
      'The ESOP tailwind rewards the credentialed, defensible practice — exactly Acuity’s position — provided its expertise is visible to the owners and advisors weighing the decision.',
      'And the firms that use AI safely — inside the perimeter, assisting the professional who signs — will out-prepare and out-pace those still doing it by hand, or, worse, doing it unsafely.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 HOW OWNERS CHOOSE AN ADVISOR ----------
docChildren.push(
  ...sectionHeader('How Owners Choose an Advisor — the Referral Economy', TEAL, '06'),
  spacer(100),
  p('This is the section that decides whether the growth plan is right or wrong, because Acuity’s engine is account-based, not a marketing funnel. Owners do not find an M&A or ESOP advisor by filling out a form. They self-educate quietly, then act on a warm introduction from a trusted advisor — most often the CPA who sees the wealth event first, sometimes the attorney or the wealth manager. The work is confidential, the relationships are long, and the decision is among the most consequential a business owner ever makes. So the job of AI here is not to generate leads; it is to build the authority that earns the introduction and to arm the partners’ relationships with intelligence.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How Acuity Wins Work', 600, 1.73),
  diagramCaption('Figure 6.0 — A confidential, referral-driven practice: owners self-educate and find Acuity through authority and warm introductions'),
  spacer(120),
  subHeader('The Owner’s Decision Journey'),
  bullet('Self-educate: the owner researches "what is an ESOP," "sell or do an ESOP," "business valuation" online — increasingly in AI answers — long before contacting anyone.'),
  bullet('Shortlist: the owner forms a mental shortlist from what they read and who their advisors mention; visible authority and proof shape it.'),
  bullet('Referral: the CPA, attorney, or wealth advisor makes a warm introduction — the single most important moment, and the #1 way owners actually engage an advisor.'),
  bullet('Engage: the relationship begins, and from here it is the credentialed team’s judgment, discretion, and process that close it — AI supports, it does not sell.'),
  spacer(120),
  buildTable(
    [ { label: 'Procurement Channel', weight: 2.6 }, { label: 'Who / How', weight: 3.4 }, { label: 'How AI Supports It', weight: 4 } ],
    [
      ['The CPA / tax advisor (the #1 COI)', 'Sees the sale or succession before anyone; more than half of an advisor’s referrals come from a handful of Centers of Influence', 'Referral-source intelligence + advisor-facing authority content that makes Acuity the easy, safe referral'],
      ['The attorney / wealth advisor', 'Estate, trust, and transaction counsel and RIAs who advise the same owners', 'COI mapping and content aimed at the questions these advisors field'],
      ['The owner’s own research', 'Self-education in search and AI answers before any contact', 'Answer-engine authority and the "decide which" decision hub'],
      ['Direct relationship & reputation', 'Repeat clients, board relationships, and the firm’s standing', 'A merchandised track record and a current, credible presence'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Authority and Intelligence, Not Volume',
    [
      'Never a lead funnel: these are the places a confidential, relationship-led firm earns the right to the conversation. Authority content earns the inquiry; intelligence arms the partner for the introduction.',
      'The reinforcing loop is the point: visible authority makes the referral easier to give and the owner more confident to call; better intelligence makes each relationship more productive.',
      'AI supports the human relationship layer — the referral, the trust, the in-person judgment — and never replaces it. Stated plainly to clients, that honesty is itself a trust signal.',
    ],
    TEAL
  ),
);

// ---------- 07 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', CORE_BLUE, '07'),
  spacer(100),
  p('The next engagement comes from a few clear pools. In a referral-led, confidential market these are won with authority and intelligence, not volume — and the program serves all of them.'),
  spacer(120),
  buildTable(
    [ { label: 'Growth Pool', weight: 2.6 }, { label: 'Who / What', weight: 3.2 }, { label: 'How Acuity Captures It', weight: 4 } ],
    [
      ['The owner-education funnel', 'Owners researching "what is an ESOP," "ESOP vs. selling," "business valuation" before engaging', 'Answer-engine-optimized education content that makes Acuity the cited, credible authority'],
      ['The "decide which" moment', 'Owners weighing a third-party sale vs. an ESOP vs. keeping it in the family', 'An "M&A vs. ESOP vs. family" decision hub — Acuity’s both-sides strength, which only it can own'],
      ['Referral sources (COIs)', 'The CPAs, attorneys, and wealth advisors who send the deals — the #1 channel', 'Referral-source intelligence and authority content aimed at the advisors, not just the owners'],
      ['Owners with transition signals', 'Closely-held businesses showing succession, age, or industry-consolidation signals', 'Signal monitoring that arms a partner with the right account at the right moment'],
      ['Local lower-middle-market (SoCal)', 'Orange County and Southern California owners searching to sell', 'Localized content that claims a search lane currently owned by brokers and law firms, not investment banks'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Reinforcing Loop',
    [
      'The searchable pools are demand that exists today — owners are researching these decisions right now; the job is to be found, trusted, and cited.',
      'The referral and signal pools are won by relationship and timing — AI surfaces the right accounts and arms the team, but the credentialed professionals and the thirty-five-year reputation close them.',
      'Each pool makes the others stronger: visible authority makes referrals easier and owners more confident, and better intelligence makes every relationship more productive.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE SEVEN ACUITY CLIENTS ----------
docChildren.push(
  ...sectionHeader('The Seven Acuity Clients', CORE_ORANGE, '08'),
  spacer(100),
  p('Acuity serves a small number of high-consequence relationships across three services, plus the referral sources who feed them. The cards below profile the seven that matter most; the matrix that follows places each by deal value and how strategic and recurring the relationship is — which is where account-based effort should concentrate.'),
  spacer(160),

  personaCard('1 — The Legacy-Minded Owner (ESOP)', CORE_ORANGE, [
    ['Role', 'An owner who wants to reward employees, keep the business independent, and exit tax-efficiently — Acuity’s deepest specialty.'],
    ['Pain Points', 'The ESOP decision is complex and unfamiliar; the valuation must be defensible to a DOL standard; the choice feels irreversible.'],
    ['Decision Driver', 'A credentialed, trusted advisor who can explain the trade-offs and stand behind a defensible valuation.'],
    ['AI Opportunity', 'Answer-engine education and a decision hub earn the early conversation; secure deal-prep AI speeds feasibility and structuring.'],
    ['Technijian Hook', 'My SEO — owner-education + decision hub. My Dev / My AI — secure ESOP deal-prep (in-perimeter).'],
  ]),
  spacer(160),
  personaCard('2 — The Retiring Founder (sell-side M&A)', CORE_BLUE, [
    ['Role', 'A boomer owner ready to sell to a third party — the core of the succession wave, often with no prior deal experience.'],
    ['Pain Points', 'Only a minority of marketed businesses actually sell; the process is confidential, complex, and once-in-a-lifetime.'],
    ['Decision Driver', 'Proof of outcomes, discretion, and a guided process — found increasingly through search and trusted referral.'],
    ['AI Opportunity', 'Authority content and a merchandised track record earn trust; AI accelerates CIMs, buyer lists, and proposals.'],
    ['Technijian Hook', 'My SEO — authority + proof scoreboard. My Dev / My AI — secure CIM / buyer-list / proposal support.'],
  ]),
  spacer(160),
  personaCard('3 — The Strategic / PE Acquirer (buy-side)', TEAL, [
    ['Role', 'A strategic buyer or private-equity sponsor engaging Acuity to find and execute acquisitions — the buy-side mandate.'],
    ['Pain Points', 'Sourcing high-fit targets is slow and relationship-bound; diligence is document-heavy and time-pressured.'],
    ['Decision Driver', 'A disciplined process, real target access, and rigorous valuation and diligence.'],
    ['AI Opportunity', 'AI target sourcing and screening from public data, plus diligence document review — securely, with the professional deciding.'],
    ['Technijian Hook', 'My AI Lead Gen — target sourcing. My Dev — secure diligence review.'],
  ]),
  spacer(160),
  personaCard('4 — The CFO / Board (valuation)', CRITICAL, [
    ['Role', 'A finance leader or board needing estate & gift, fairness, stock-comp, or financial-reporting valuations — the recurring relationship.'],
    ['Pain Points', 'Wants rigor, defensibility, and responsiveness; values a credentialed firm that stands behind the number.'],
    ['Decision Driver', 'Credentials (ASA / ABV / CFA), defensibility, and turnaround.'],
    ['AI Opportunity', 'AI speeds first-pass spreads and comps the credentialed professional verifies and signs; content sustains visibility.'],
    ['Technijian Hook', 'My AI — secure spreading / comps support. My SEO — valuation content authority.'],
  ]),
  spacer(160),
  personaCard('5 — The Family-Business Successor', PURPLE, [
    ['Role', 'A next-generation or family owner weighing family retention vs. a sale or ESOP — a high-trust, multi-path decision.'],
    ['Pain Points', 'Balancing legacy, fairness, and economics; wants a guide who has navigated all three paths.'],
    ['Decision Driver', 'A firm that does M&A and ESOP and can advise the trade-off honestly.'],
    ['AI Opportunity', 'The decision hub and education content position Acuity as the both-sides expert.'],
    ['Technijian Hook', 'My SEO — the decision hub and family-transition content.'],
  ]),
  spacer(160),
  subHeader('The Multipliers — Referral Sources'),
  personaCard('6 — The CPA / Tax Advisor (Center of Influence)', GOLD, [
    ['Role', 'The accountant who sees the sale or succession first — the single most important referral source in the market.'],
    ['Pain Points', 'Will only refer a firm that makes the CPA look good and is easy to find, vouch for, and trust with a client.'],
    ['Decision Driver', 'A visible, credible, current presence and proof they can point a client to.'],
    ['AI Opportunity', 'Referral-source intelligence and advisor-facing authority content make Acuity the easy, safe referral.'],
    ['Technijian Hook', 'My AI Lead Gen — COI intelligence. My SEO — advisor-facing authority content.'],
  ]),
  spacer(160),
  personaCard('7 — The Attorney / Wealth Advisor (Center of Influence)', PASS, [
    ['Role', 'Estate, trust, and transaction counsel and RIAs who advise the same owners and influence the decision.'],
    ['Pain Points', 'Need a credible specialist to bring in without risk to the client relationship.'],
    ['Decision Driver', 'Specialist credibility, discretion, and a clean track record.'],
    ['AI Opportunity', 'Content aimed at the questions these advisors field, and intelligence on the relationships worth deepening.'],
    ['Technijian Hook', 'My SEO — advisor-facing content. My AI Lead Gen — relationship intelligence.'],
  ]),
  spacer(200),
  p('Figure 8.0 places each by deal value and strategic, recurring value — the ESOP owner and the referral sources carry the most strategic weight, which is where account-based effort should concentrate.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Acuity Client Matrix', 580, 1.50),
  diagramCaption('Figure 8.0 — Client Matrix: Deal / Account Value vs. Strategic & Recurring Value'),
);

// ---------- 09 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '09'),
  spacer(100),
  p('Acuity competes in a category that is, almost uniformly, content-shy and answer-engine-blind. A few firms lead on owner-education or ESOP webinars; one regional peer leads on Southern California content. But no one has claimed the answer-engine position, the "M&A vs. ESOP decision" content, or the local lower-middle-market search lane — and Acuity, doing both M&A and ESOP with a national platform behind it, is positioned to take all three.'),
  spacer(140),
  buildTable(
    [ { label: 'Competitor', weight: 2.2 }, { label: 'Focus / Reach', weight: 3 }, { label: 'Posture vs. Acuity', weight: 4 } ],
    [
      ['Objective, IB & Valuation', 'LA + San Diego; M&A + valuation', 'The SoCal content leader — Content Hub, Insights, and a tombstone feed posting into 2026; the regional bar to beat'],
      ['Generational Group', 'Dallas, national; 300+ pros, 1,800 deals', 'Owns the broad owner-education funnel (115K+ owners educated) — national, not local or ESOP-deep'],
      ['Prairie Capital Advisors', 'Chicago, national; M&A or ESOP "Dual Path"', 'The closest strategic mirror (does both) — strong ESOP webinars; the decision-content benchmark'],
      ['ButcherJoseph & Co.', 'St. Louis + 8 offices; ESOP + M&A', 'ESOP content competitor — blog, whitepapers, earned media; national, not SoCal'],
      ['CSG Partners', 'National; leveraged-ESOP investment banking', 'Direct ESOP-advisory rival with an ESOP client-story library'],
      ['Meritage Partners', 'Irvine (backyard); lower-middle-market M&A', 'Local peer — has a podcast, but little written library or search visibility'],
      ['Cabrillo Advisors', 'San Diego; valuation-led', 'Partial overlap on valuation; lighter owner-education content'],
    ],
  ),
  spacer(200),
  subHeader('Content & Answer-Engine Scorecard'),
  p('Reduced to what now decides credibility — owner-education content, answer-engine visibility, and a published track record — the picture is clear, and it shows the move available to a credential-heavy firm with a national platform.'),
  buildTable(
    [ { label: 'Player', weight: 2.6 }, { label: 'Owner Education', weight: 1.9, align: AlignmentType.CENTER }, { label: 'AEO / AI Answers', weight: 1.9, align: AlignmentType.CENTER }, { label: 'Track Record', weight: 1.7, align: AlignmentType.CENTER }, { label: 'Verdict', weight: 2.4 } ],
    [
      ['Generational', { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: '1,800', color: PASS, align: AlignmentType.CENTER }, 'Owns broad education'],
      ['Objective IBV', { text: 'Good', color: PASS, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Tombstones', align: AlignmentType.CENTER }, 'SoCal content leader'],
      ['Prairie Capital', { text: 'ESOP', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Webinars', align: AlignmentType.CENTER }, 'Decision-content mirror'],
      [{ text: 'Acuity (today)', bold: true }, { text: 'Articles', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Un-scored', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'Real authority, uncaptured', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 9.0 plots the field. The whole category sits low on answer-engine maturity — the cited answers come from accounting firms and the NCEO nonprofit, not the deal banks. The realistic move for Acuity is straight up-and-right: own the answer-engine position and the decision content no competitor has claimed.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. Content & Answer-Engine Maturity', 580, 1.50),
  diagramCaption('Figure 9.0 — Competitive Positioning: Scale / Reach vs. Content & Answer-Engine Maturity'),
  spacer(160),
  calloutBox(
    'Where Acuity Wins',
    [
      'The answer-engine and decision-content corner is empty — even the content leaders are not optimized for the AI answers and search results owners now rely on. First mover earns compounding, credible authority.',
      'Acuity uniquely does both M&A and ESOP, so it alone can own the "decide which" content owners agonize over — a position only Prairie has even attempted, and not locally.',
      'And the local Southern California lower-middle-market lane is owned by brokers and law firms, not investment banks — open ground for a credential-heavy Orange County firm.',
    ],
    CORE_BLUE
  ),
);

// ---------- 10 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '10'),
  spacer(100),
  p('For a thirty-five-year, credential-heavy, platform-backed firm, the digital presence under-represents the authority — and the gaps are precise and fixable. To be clear: Acuity is not content-thin. The issue is that real expertise is not structured for the way owners and AI engines now find it.'),
  spacer(140),
  buildTable(
    [ { label: 'Digital Asset', weight: 2.6 }, { label: 'Current State', weight: 3.2 }, { label: 'Gap / Opportunity', weight: 4.2 } ],
    [
      ['Answer-engine visibility', 'A real article library, but undated and without the structure AI answers and search reward', 'The single biggest fixable gap — make existing expertise the cited answer owners and advisors find'],
      ['The "decide which" content', 'No "M&A vs. ESOP vs. family" decision hub, despite doing all three', 'The one piece of content only Acuity can own — the owner’s hardest decision'],
      ['Track-record proof', 'Eight case studies; no published deal count or scoreboard', 'Thirty-five years and hundreds of ESOP transactions, un-merchandised — a credibility asset left on the table'],
      ['Multimedia & guides', 'Articles only — no podcast, webinars, video, or gated guides', 'The formats peers use to build the owner and referral relationship'],
      ['Social presence', '~2,000 LinkedIn followers; light, monthly cadence', 'Modest reach for the West Coast’s largest ESOP practice'],
      ['The platform story', 'The Marshall & Stevens backing is barely surfaced', 'A credibility and scale signal — national resources behind a local, senior team'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the firm — only making real, existing authority visible the way owners and AI engines now find it.',
      'The answer-engine fix, the decision hub, and the proof scoreboard are low-cost, compounding moves in a category no one else has claimed.',
      'They are also the natural first ninety days: make the expertise visible and structured, then build the referral intelligence and the secure deal-prep engine on top.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When an owner — or the CPA advising one — asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Should I sell my business to a third party or do an ESOP? Who advises on this in Southern California?"', [
    'TODAY — the AI assistant answers with whichever sources have the strongest, best-structured content it can read: it explains the trade-off in general terms, points to the NCEO nonprofit and a couple of national accounting and advisory firms, and does NOT mention Acuity — even though Acuity uniquely does both M&A and ESOP and is the West Coast’s largest ESOP practice. Acuity is invisible at the exact moment the owner is forming a shortlist.',
    'AFTER AEO — the same query returns Acuity as a cited authority ("Acuity Advisors, a Marshall & Stevens company, advises owners across both M&A and ESOP and is the largest ESOP advisory practice on the West Coast…"), with the decision hub and the merchandised track record as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result would be captured as the baseline in discovery.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter Acuity is not cited, the assistants learn to answer "what is an ESOP" and "ESOP vs. selling my business" with someone else — and that default, once set in the training and retrieval data, is far harder and more expensive to dislodge than to claim now. The whole category is answer-engine-blind today, which is exactly why the window is open; it is widest before a competitor — Prairie, Generational, or a regional content leader — builds its own AI-answer presence. The cost of waiting is not zero — it is a competitor becoming the default answer to the questions Acuity is uniquely qualified to answer.'),
);

// ---------- 11 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof — What We’ve Built', CORE_BLUE, '11'),
  spacer(100),
  p('This section is the credibility centerpiece, and it comes before the AI growth pitch. Technijian already runs and secures Acuity’s environment, so we know the systems, the data, and the controls — which makes everything here faster and lower-risk to deploy. We separate two things plainly: proven builds Technijian has actually delivered, and the productized services Acuity would engage. We have not built an AI deal-preparation platform for an M&A and ESOP advisor before, and we say so; what follows maps real capabilities to this specific firm, honestly labeled.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence inside a FINRA Broker-Dealer’s Controls',
    'Technijian deployed AI document intelligence that auto-populates complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review — inside the firm’s supervision and review controls.',
    'This maps directly to Acuity and its affiliated broker-dealer, Edgewater Capital: the same approach speeds CIMs, teasers, proposals, and diligence document review — under the firm’s existing compliance review, and inside the secure perimeter.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants — cutting content-production time roughly 70%.',
    'This is the engine that makes Acuity’s expertise visible: own "what is an ESOP," "ESOP vs. sale," and "business valuation" in Google and AI answers, and finally publish the decision content no deal bank has claimed.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Knowledge System — Weaviate + Obsidian Institutional Memory',
    'Technijian builds vector-search knowledge systems that turn years of files and tribal knowledge into a searchable, AI-queryable memory — surfacing the right precedent in seconds instead of hours.',
    'For Acuity it captures thirty-five years of deals and the senior team’s expertise into matched precedents for the next pitch — the institutional memory that survives a retirement and sharpens every proposal.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'LLM Council — Three-Model Peer Review for Defensible Output',
    'Technijian built an LLM Council pattern (ScamShield) in which three independent models review and challenge one another’s output before anything is finalized — raising accuracy and catching errors a single model misses.',
    'For a firm whose core deliverable is a defensible valuation or opinion, the same peer-review pattern strengthens first-pass analysis the credentialed professional then verifies and signs — accuracy as a discipline, not a hope.',
    'built'
  ),
  spacer(140),
  subHeader('Productized Services Acuity Would Engage'),
  capabilityBox(
    'My SEO — Answer-Engine, Owner Education & Local',
    'My SEO is Technijian’s local and answer-engine search service — answer-engine optimization, education and decision content, schema and structure, and local search. (New for Acuity — there is no SEO program today.)',
    'It makes the real expertise visible: the owner-education funnel, the "M&A vs. ESOP vs. family" decision hub, a merchandised proof scoreboard, and the Southern California search lane.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Referral & Account Intelligence',
    'My AI Lead Gen is Technijian’s productized intelligence service — it identifies and profiles high-fit accounts from public data, enriches and prioritizes them, and supports targeted, relationship-led outreach (not volume prospecting).',
    'For Acuity it maps and nurtures the CPAs, attorneys, and wealth advisors who send deals, and flags owners showing transition signals — arming the partners’ relationships, not replacing them.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev & My AI — Secure, In-Perimeter Deal-Prep AI',
    'My Dev and My AI are Technijian’s custom-application and applied-AI services — built on an AI-native lifecycle and deployed inside the client’s own security perimeter, integrating with the platforms already in place (here, Dynamics 365, Egnyte/ShareFile, and Upslide).',
    'For Acuity they build the secure CIM / teaser / proposal acceleration, due-diligence review, financial-spreading support, and the institutional-knowledge system — AI assisting the credentialed professional who signs.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across content, referral intelligence, and secure deal-prep: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [ { label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER } ],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass, compliance-sensitive answers, deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — owner-education content, COI outreach personalization, summarization, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, extraction, enriching and tagging thousands of referral-source and account records', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Acuity pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. For example, a single owner-education article is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 12 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Acuity Leadership', CORE_BLUE, '12'),
  spacer(100),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Acuity sits today, how to adopt it without risk, and what comparable firms are already doing. The goal is that Chris, the senior team, and Ann can judge every recommendation that follows on its merits — and confirm that none of it crosses the confidentiality boundary the firm runs on.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft a first-pass teaser from these deal facts." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch for owners showing transition signals and flag the ones worth a partner’s call." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Acuity starts with simple automations that pay off in the first ninety days — always with the credentialed professional reviewing and signing — and adds autonomous agents only where the value is proven. That is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Acuity Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run firms — including Acuity — sit at the first or second rung of the widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Acuity Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'A secure IT foundation is in place and AI is being introduced deliberately, but it is not yet woven into growth or deal operations', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — owner-education content, referral intelligence, deal-prep — with measured results, the professional signing', ''],
      ['4. Scaled', 'AI is embedded across growth and the deal process with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the firm runs and competes, inside the perimeter', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Acuity is well placed to move: the secure perimeter Technijian already runs makes it one of the few firms in its category that can build AI safely, in-house, rather than reaching for a public tool. This report is the plan to reach Operational — AI working in the growth engine and inside the deal process — within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a confidential, securities-affiliated firm like Acuity, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything client-facing or compliance-bound — AI drafts, the credentialed professional verifies and signs the valuation or opinion'],
      ['Data leakage', 'Confidential deal data pasted into public tools can escape — and a federal court has held public-AI documents are not privileged', 'Private, in-perimeter AI deployments — NDA-bound deal data, valuations, and data-room files never touch a public model; AI runs inside the security perimeter Technijian already protects'],
      ['Compliance & accountability', 'Untracked AI tools create audit and supervision gaps', 'Every AI tool inventoried with owner, vendor, and data source; outbound content follows the firm’s existing FINRA/Edgewater review — led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Firms Are Already Doing', { color: CORE_BLUE }),
  bullet('Professional-services advisory: M&A and valuation practitioners are using generative AI to accelerate deal sourcing, first-draft CIMs, and document-heavy diligence — industry surveys put adoption among M&A practitioners in the mid-40% range in 2025 and rising.'),
  bullet('Owner-education marketing: advisory firms are using AI search optimization to become the cited answer when owners ask AI tools "what is an ESOP?" or "should I sell or do an ESOP?" — capturing demand competitors never see.'),
  bullet('Regulated, document-heavy firms: securities-affiliated and other regulated businesses are turning multi-day proposal and compliance assembly into a minutes-long, audit-ready draft — responding to more opportunities with the same team, inside their own controls.'),
  p('These are representative directions of travel across comparable firms, not guarantees; Acuity’s own numbers would be confirmed in discovery. Technijian’s specific, measured results from prior builds appear in Section 11 (Capability Proof) and Section 13.', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — An Acuity Deal Professional', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A banker preparing a sell-side process builds the teaser and CIM largely by hand, re-keys the same company facts across documents, assembles the buyer list from memory and past deals, and reconstructs precedent from files scattered across thirty-five years of engagements — much of it held in a few senior people’s heads.',
    'WITH AI (in-perimeter): A secure assistant drafts the first-pass teaser, CIM, and buyer list from the deal facts and the firm’s own precedent library in minutes; the banker reviews, corrects, and the credentialed professional signs. Confidential data never leaves the perimeter, the institutional memory survives a retirement, and the senior team spends its hours on judgment and relationships — not re-keying.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but Acuity assembles, secures, and governs everything — and for a confidential firm the public-tool shortcut is exactly the one it cannot safely take'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance for a regulated practice'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team that already runs and secures Acuity’s perimeter — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); the widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 13 AI ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Acuity’s Growth Engine', CORE_BLUE, '13'),
  spacer(100),
  p('The engine runs three motions at once: get cited (own the owner-education and decision content that earns authority), win the referral and the owner (intelligence on the advisors who send deals and the owners showing signals), and run leaner and remember (secure, in-perimeter deal-prep AI and a thirty-five-year knowledge system). Every part builds on the IT and security foundation Technijian already runs for Acuity — and respects the boundary that protects the firm.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Acuity AI Engine', 600, 1.61),
  diagramCaption('Figure 12.0 — The Engine: Get Cited, Win the Referral & Owner, and Run Leaner & Remember'),
  spacer(160),
  buildTable(
    [ { label: 'Motion', weight: 1.9 }, { label: 'Play', weight: 2.5 }, { label: 'What It Does', weight: 3 }, { label: 'Metric', weight: 1.5 }, { label: 'Service', weight: 1.5 } ],
    [
      ['Get Cited', 'Answer-engine + owner education', 'Own ESOP, sale, and valuation questions in Google and AI answers', 'Cited authority', 'My SEO'],
      ['Get Cited', 'M&A-vs-ESOP decision hub', 'The both-sides decision content only Acuity can own', 'Organic reach', 'My SEO'],
      ['Get Cited', 'Proof scoreboard', 'Merchandise thirty-five years and the track record', 'Credibility', 'My SEO'],
      ['Get Cited', 'Local SoCal content', 'Claim the Orange County lower-middle-market search lane', 'Local visibility', 'My SEO'],
      ['Win Referral & Owner', 'Referral (COI) intelligence', 'Map and nurture the CPAs, attorneys, and advisors who send deals', 'Referral activity', 'My AI Lead Gen'],
      ['Win Referral & Owner', 'Owner transition signals', 'Flag owners showing succession or industry signals', 'Qualified accounts', 'My AI'],
      ['Win Referral & Owner', 'Pitch / CIM / proposal accel', 'First-draft pitchbooks, teasers, proposals — securely', 'Time-to-proposal', 'My Dev'],
      ['Win Referral & Owner', 'Relationship intelligence', 'Warm-intro paths and COI tracking in Dynamics', 'Pipeline quality', 'My AI'],
      ['Run Leaner & Remember', 'Institutional-knowledge system', 'Thirty-five years of deals into matched precedents', 'Pitch speed', 'My AI'],
      ['Run Leaner & Remember', 'Due-diligence review', 'Flag change-of-control, indemnity, liabilities faster', 'Diligence hours', 'My Dev'],
      ['Run Leaner & Remember', 'Financial spreading support', 'First-pass spreads and comps the professional signs', 'Throughput / pro', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'AI augments the credentialed professionals and the relationships — it does not replace them. The professional’s judgment is the product; AI makes the firm faster and more visible around it.',
      'It integrates around the systems Acuity already uses — Dynamics 365, Egnyte/ShareFile, Upslide — and runs inside the security perimeter Technijian already protects. It enhances the workflow; it does not replace it.',
      'And the rule never bends: confidential deal data never touches public AI; the CFA/ASA professional signs every valuation and opinion.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 14 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '14'),
  spacer(100),
  p('This section shows where the value comes from and what the program costs. Acuity’s managed IT and security are already in place — this plan adds the growth layer on top. Pricing shows real published Technijian rates where they exist and "to be determined in discovery" everywhere else; the return is shown as the method we will measure, not an invented multiple. The discovery questions in Section 16 replace estimates with Acuity’s real baselines.'),
  spacer(140),
  subHeader('The Entry Program — The 90-Day AI Visibility Pilot', { color: CORE_BLUE }),
  p('Start with one clearly-scoped, modest, published-rate program — not an open-ended engagement. The pilot stands up Acuity’s answer-engine visibility and the decision content no deal bank has claimed, and proves the lift before any larger secure-build is discussed. It is the entry tier detailed in the investment map below: My SEO plus the My AI Lead Gen Starter, on the IT and security foundation already in place.'),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, Acuity is cited by at least one major AI assistant (ChatGPT, Perplexity, or Microsoft Copilot) for a high-intent owner-decision query — for example "what is an ESOP" or "should I sell or do an ESOP in California" — and the "M&A vs. ESOP vs. family" decision page is live and capturing inquiries.',
      'Our commitment: the entry program is month-to-month, no lock-in, with no obligation to continue if it does not hit the metric by day 90 — and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('Projected Lift (Estimated)'),
  buildTable(
    [ { label: 'Measure', weight: 3 }, { label: 'Current State', weight: 2.6 }, { label: 'With the Program', weight: 2.6 }, { label: 'Direction', weight: 1.8 } ],
    [
      ['Answer-engine visibility', 'Absent', 'Cited for ESOP / sale / valuation', 'Authority inbound'],
      ['Decision content', 'None', '"M&A vs. ESOP" hub owned', 'Differentiated'],
      ['Track-record proof', 'Un-scored', 'Merchandised scoreboard', 'Credibility'],
      ['Referral intelligence', 'None', 'COI mapped + nurtured', 'More warm intros'],
      ['Deal-prep throughput', 'Manual first drafts', 'Secure AI-assisted', 'Revenue per professional'],
      ['Institutional knowledge', 'In people’s heads', 'Captured + searchable', 'Faster, sharper pitches'],
    ],
  ),
  spacer(160),
  subHeader('How We’ll Measure the Return (Illustrative)'),
  p('We do not lead with a multiple we cannot back. Year-1 return is modeled from the levers below, each tied to a number Acuity already tracks — so the model is built from real baselines in discovery, not assumed here.'),
  buildTable(
    [ { label: 'Value Lever', weight: 3 }, { label: 'The Mechanism', weight: 4 }, { label: 'The Number We Calibrate From', weight: 3 } ],
    [
      ['Authority inbound', 'Answer-engine + decision content earns cited authority and inbound inquiries in a referral market', 'Current inbound mix and engagement sources'],
      ['Referral activation', 'COI intelligence and advisor-facing content produce more warm introductions — the #1 channel', 'Referral mix and conversion by source'],
      ['Revenue per professional', 'Secure deal-prep AI raises the engagements each credentialed banker can carry', 'Engagements/year, average fee, time-to-proposal'],
    ],
  ),
  spacer(60),
  p('Illustrative until discovery — no number we can’t back. Revenue is attributed to the program, not guaranteed; a single additional engagement in this market can outweigh the entire program cost.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Technijian Service Investment Map (Land-and-Expand)'),
  p('The managed IT and security are already in place. Lead with a modest entry program that makes the authority visible and arms the referral relationships; add the secure deal-prep build as a later expansion, once the entry proves the lift. Published rates are shown where they exist; the rest is scoped in discovery.'),
  buildTable(
    [ { label: 'Service', weight: 2.9 }, { label: 'Scope', weight: 3.7 }, { label: 'Monthly', weight: 1.6 }, { label: 'Investment', weight: 1.6 } ],
    [
      ['Managed IT + Cybersecurity', 'CrowdStrike, Huntress, Umbrella, INKY, Meraki, Veeam, RMM, audits, M365 hardening — the secure foundation', { text: 'In place', color: PASS }, { text: 'Current engagement', color: PASS }],
      ['My SEO — Answer-Engine, Owner Education & Local', 'AEO + decision hub + proof scoreboard + local content (new for Acuity)', '$500–$1,500/mo*', 'Published tier'],
      ['My AI Lead Gen — Referral & Account Intelligence (Starter)', 'COI intelligence + owner transition signals; relationship-led, not volume', '$1,499/mo*', '+ $2,500 setup'],
      [{ text: 'My AI — Readiness Workshop + Content Engine kickoff', }, 'Leadership alignment, the boundary, and the content engine', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'THE 90-DAY AI VISIBILITY PILOT (ENTRY)', bold: true }, { text: 'Builds on the IT + security already in place; the new cost is My SEO + Lead Gen Starter + the TBD item — month-to-month, no lock-in', bold: true }, { text: '', bold: true }, { text: 'In place + new', bold: true, color: CORE_BLUE }],
      [{ text: 'My Dev / My AI — Secure Deal-Prep Build (Phase 2)', }, 'In-perimeter CIM / teaser / proposal + DD review + institutional-knowledge system', '—', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'My Dev — Managed App Services (Phase 2)', }, 'Hosting, monitoring, and support for the secure AI platform', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'My AI — Fractional AI Advisor (Phase 2)', }, 'Program leadership across authority, referral, and deal-prep', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'Finalized after discovery', bold: true }, { text: '', bold: true }, { text: 'TBD', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(60),
  p('* Real published Technijian list rates. Acuity’s managed IT and security are already in place (a current engagement), so they are not re-priced here. My SEO is new for Acuity — published tiers run $500–$1,500/mo (final tier set in discovery). My AI Lead Gen Starter is $1,499/mo plus a one-time $2,500 setup. My AI, My Dev, the secure deal-prep build, managed app services, the advisor, and the workshop have no published rate and are scoped in discovery — the Year-1 total is finalized then.', { italics: true, size: 18 }),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'The cheapest wins come first: making real expertise answer-engine-visible and merchandising the track record start earning authority and inquiries on a modest, published-rate entry — with no large build to begin.',
      'In this market the economics are asymmetric: a single additional ESOP or sell-side engagement can outweigh the entire year’s program cost many times over.',
      'And because Technijian already runs and secures the environment, the secure deal-prep build deploys inside a perimeter we already manage — the one place a confidential firm can safely use AI.',
    ],
    CORE_BLUE
  ),
);

// ---------- 15 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '15'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence: make the authority visible first, then activate the referral intelligence, then build the secure deal-prep and knowledge engine. The lowest-cost, highest-visibility wins land in the first ninety days; the secure build gets realistic runway and proper compliance review.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Acuity 90-180-270 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 14.0 — Acuity Growth Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Make real expertise visible the way owners and AI engines now find it.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Answer-Engine + Owner Education', 'Optimize and structure the existing content for AI answers and search; publish the first owner-education explainers (ESOP, sale, valuation) with schema and dates.'],
      ['1.2 — Decision Hub + Proof Scoreboard', 'Build the "M&A vs. ESOP vs. family" decision hub Acuity uniquely can own, and merchandise thirty-five years of track record into a searchable proof scoreboard.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Authority & Referral (Days 91–180)', { color: TEAL }),
  p('Extend the authority and arm the relationships.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Referral (COI) Intelligence', 'Map and begin nurturing the CPAs, attorneys, and wealth advisors who send deals; stand up advisor-facing authority content.'],
      ['2.2 — Owner Signals + Local Content', 'Turn on owner transition-signal monitoring for the partners, and claim the Southern California lower-middle-market search lane.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Remember (Days 181–270)', { color: CORE_ORANGE }),
  p('Build the secure deal-prep and knowledge engine inside the perimeter.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Secure Deal-Prep AI', 'Build the in-perimeter CIM / teaser / proposal acceleration and due-diligence review, under the firm’s compliance review and Edgewater’s controls.'],
      ['3.2 — Knowledge System + ROI Dashboard', 'Stand up the institutional-knowledge system (matched precedents) and deliver the ROI dashboard against the Section 16 baselines.'],
    ],
  ),
);

// ---------- 16 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '16'),
  spacer(100),
  p('Five actions Acuity can take immediately — before any expanded engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Publish One Schema-Marked "What Is an ESOP?" Answer Page',
    ['Take the firm’s real ESOP expertise and structure one definitive, schema-marked answer page. It claims the AI-answer result no deal bank owns and signals the whole answer-engine strategy at almost no cost.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Date and Structure the Existing Articles',
    ['The resources library is real but undated and unstructured. Adding dates, FAQ structure, and author credentials makes existing content visible to AI answers and search — a fast, free lift on work already done.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Build One "Sell vs. ESOP vs. Family" Decision Page',
    ['Publish a single page explaining the trade-off owners agonize over. Acuity does all three — it is the one piece of content only this firm can credibly own, and the closest competitor (Prairie) is national, not local.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Stand Up a Simple Track-Record Scoreboard',
    ['Add a credible, current scoreboard — thirty-five years, the West Coast’s largest ESOP practice, the named transactions — so a prospective owner or referring advisor sees the proof at a glance.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Create One Referral-Source Resource Page',
    ['Give the CPAs and attorneys who refer deals something easy to share — a clear, credible "for advisors" page. It makes Acuity the safe, easy referral and seeds the COI-intelligence program.'],
    CORE_BLUE),
);

// ---------- 17 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '17'),
  spacer(100),
  p('The honest answers to the questions Acuity’s leadership is most likely asking right now.'),
  spacer(120),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already handle our own marketing. Why add Technijian?', bold: true }, 'We do not replace it — we add the layer no one in the category has built: answer-engine optimization (AEO), the "M&A vs. ESOP vs. family" decision hub, the merchandised proof scoreboard, and the referral and deal-prep AI that ordinary marketing does not touch. And because we already run and secure your environment, we build the AI part inside the perimeter — which an outside SEO agency cannot safely do for a confidential firm.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — owner-education content and secure first-drafts a credentialed professional then signs — not autonomous "agents" doing the firm’s judgment. We use the simplest tool that works, measure it, and only expand what earns its place.'],
      [{ text: 'Is our confidential deal data safe?', bold: true }, 'Yes — and this is the whole point. Confidential deal data, valuations, and data-room files never touch a public AI model; we deploy private, in-perimeter systems with human review on anything compliance-bound, led by a CISSP-certified team, inside the security perimeter Technijian already runs for you. A federal court has held public-AI documents are not privileged — which is exactly why the public-tool shortcut is closed to a firm like Acuity, and the secure build is the only safe path.'],
      [{ text: 'We’re a lean senior team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give the senior team back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing what we draft and sign. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry program is the 90-day AI Visibility Pilot with a defined success metric (Section 14), month-to-month with no lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry pilot uses real published rates only — My SEO ($500–$1,500/mo) plus the My AI Lead Gen Starter ($1,499/mo + $2,500 setup), on the IT and security already in place. The secure deal-prep build and the rest are scoped in discovery (Section 14), only after the pilot proves the lift. No invented totals, no hidden fees.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 18 CONCLUSION & NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('Conclusion & Next Steps', DARK_CHARCOAL, '18'),
  spacer(100),
  p('Acuity has the hard things: thirty-five years, a CFA- and ASA-credentialed team, the West Coast’s largest ESOP practice, a national platform in Marshall & Stevens, an affiliated FINRA broker-dealer, and a real track record across M&A, ESOP, and valuation. What it has not yet done is make that authority visible where owners and their advisors now look — and use AI, safely, to do more with the senior team it has.'),
  p('The opportunity is concrete and low-risk: own the answer-engine and decision content no competitor has claimed, arm the referral relationships with intelligence, and build secure deal-prep AI inside the perimeter Technijian already protects. Because we already run and secure the environment, this is the rare growth program that starts on a foundation the partner already manages — and respects the confidentiality the firm runs on. The boundary that governs the work — AI assists, the credentialed professional signs, confidential data stays in the perimeter — is not a limitation on the strategy. It is the strategy’s moat.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 16 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the answer-engine foundation, the decision hub, and the proof scoreboard — inside 30 days.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'We already secure your environment. Let’s turn it into a growth engine.', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ] })] })],
  }),
);

// ---------- 19 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '19'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000 — and already Acuity’s managed-IT and security partner. We build and operate the AI systems that help firms compete at scale, with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Acuity', weight: 5 }],
    [
      ['My IT + Security (in place)', 'The managed IT, endpoint defense, and Microsoft 365 hardening Technijian already runs — the secure perimeter the growth program builds inside'],
      ['My SEO', 'Answer-engine optimization, owner-education and decision content, and the proof scoreboard that make Acuity’s authority visible'],
      ['My AI Lead Gen', 'Referral-source intelligence and owner transition-signal monitoring — supporting the relationship-led pipeline'],
      ['My Dev & My AI', 'Secure, in-perimeter deal-prep AI — CIM / teaser / proposal acceleration, diligence review, and the institutional-knowledge system'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Works Cited & Data Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted June 2026, plus Acuity’s existing Technijian engagement records. Company details (founding year, ownership, leadership, services, the Marshall & Stevens acquisition, the affiliated broker-dealer) are drawn from public sources and the firm’s own materials and should be confirmed with Acuity before external use.', { italics: true }),
  spacer(120),
  p('1. Acuity Advisors — acuityadvisors.com (About, Our Team, Christopher A. Kramer bio, Services, M&A Advisory, Experience/Case Studies, Resources, "Strategic Equity Group is now Acuity Advisors"); LinkedIn (acuity-investment-bankers).', { size: 20 }),
  p('2. Marshall & Stevens acquisition (2024-09-04) — Marshall & Stevens article; PR Newswire release 302237303. Affiliated broker-dealer Edgewater Capital, LLC — FINRA BrokerCheck (CRD #128898).', { size: 20 }),
  p('3. Succession wave & planning gap — Project Equity; the Exit Planning Institute (73% plan to transition; ~19% have started; 20–30% of marketed businesses sell; exit-education and valuation adoption 2013→2023).', { size: 20 }),
  p('4. ESOP & policy — the National Center for Employee Ownership (≈6,600 ESOPs, $2T+ assets); congress.gov (the WORK Act and 2025 employee-ownership legislation); RSM / DOL (ESOP "adequate consideration" rulemaking).', { size: 20 }),
  p('5. Lower-middle-market M&A — GF Data and Capstone Partners (EV/EBITDA multiples by tier); PwC and EY (2026 deal outlook). M&A broker exemption — Securities Exchange Act §15(b)(13) (Jones Day, Goodwin).', { size: 20 }),
  p('6. AI in M&A — Bain (GenAI in M&A, 2024–2026 adoption: 16%→21%→45%); McKinsey (~20% cost reduction, via CFO Dive); Mayer Brown and EthosData (use cases); court guidance on public-AI privilege waiver (U.S. v. Heppner; Trinidad v. OpenAI).', { size: 20 }),
  p('7. Competitors — Objective Investment Banking & Valuation, Generational Group, Prairie Capital Advisors, ButcherJoseph & Co., CSG Partners, Meritage Partners, Cabrillo Advisors (public sites, Mergr/PitchBook listings).', { size: 20 }),
  p('8. Technijian capabilities & pricing — My SEO published tiers ($500–$1,500/mo plus add-ons), My AI Lead Gen ($1,499 Starter + $2,500 setup); My AI and My Dev scoped per engagement; documented Proven Results (AI Document Intelligence inside a FINRA broker-dealer; Multi-Agent SEO + Answer-Engine Platform; Weaviate/Obsidian knowledge system; LLM Council peer review). Existing engagement per Technijian managed-services records.', { size: 20 }),
  p('9. AI field guide (Section 12) — MIT Sloan Management Review (AI literacy for executives); Anthropic (Building Effective Agents — the automation/workflow vs. agent distinction); the widely-used five-stage AI maturity model, consistent with the Gartner and Google Cloud AI adoption frameworks; U.S. NIST AI Risk Management Framework (Govern / Map / Measure / Manage). Court guidance on public-AI privilege (U.S. v. Heppner) per source 6.', { size: 20 }),
);

// =====================================================================
const doc = new Document({
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } } }] }] },
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: docChildren }],
});

const OUT_PATH = path.join(__dirname, 'Acuity-Advisors-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
