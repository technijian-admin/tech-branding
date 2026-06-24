// CardLogix (CDLX) — Managed Hardware-Backed PKI: Three Deployment Models
// Technijian-branded DOCX report for Nick Schooler to review all options.
// Pattern adapted from Clients/CDLX/build-cdlx-report.js (AAVA/TALY/VAF/SCF/ORX/RKE lineage).
// LOGO: authentic assets/Technijian Logo 2.png (NOT the brand-tokens AI-fake path). TOC: live field.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ---------- Brand constants ----------
const tokens = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'
));
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

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

// AUTHENTIC logo (assets/ root, ratio ~4.78) — light backgrounds. NOT assets/logos/png/* (AI fakes).
const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const TODAY = '2026-06-22';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

// ---------- Helpers ----------
function spacer(size = 200) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] });
}
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })],
  });
}

// Section header — hidden Heading1 (feeds the live TOC) + visual banner row.
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
  });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [120, CONTENT_W - 120],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 120, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 120, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 100, bottom: 100, left: 200, right: 0 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })],
      }),
    ]})],
  });
  return [headingPara, visualTable];
}

// Non-Heading front-matter header (e.g. "Table of Contents") — NOT in the TOC.
function plainHeader(text, color = CORE_BLUE) {
  return new Paragraph({
    keepNext: true,
    spacing: { before: 120, after: 160 },
    children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })],
  });
}

function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    keepNext: true, keepLines: true,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })],
  });
}

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}

function leadBullet(lead, body, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [
      new TextRun({ text: lead, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }),
      new TextRun({ text: body, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  });
}

function numberedSteps(items) {
  return items.map((t, i) => new Paragraph({
    spacing: { before: 30, after: 70, line: 300 },
    indent: { left: 520, hanging: 520 },
    children: [
      new TextRun({ text: `${i + 1}.`, size: 22, bold: true, color: CORE_BLUE, font: FONT_HEAD }),
      new TextRun({ text: '\t', size: 22, font: FONT_BODY }),
      new TextRun({ text: t, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  }));
}

function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({
    keepNext: true, keepLines: true,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })],
  });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({
    keepNext: i < bodyArr.length - 1, keepLines: true,
    spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({
        width: { size: 80, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 80, type: WidthType.DXA },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [titleP, ...bodyParas],
      }),
    ]})],
  });
}

function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    borders: noBorders,
    margins: { top: 200, bottom: 200, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 36, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ],
  });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })],
  });
}

function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  const diff = CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  colWidths[colWidths.length - 1] += diff;

  const headerCells = columns.map((c, i) => new TableCell({
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { fill: headerColor, type: ShadingType.CLEAR },
    borders: cellBorders,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })],
  }));

  const dataRows = rows.map((row, ri) => new TableRow({
    cantSplit: true,
    children: row.map((cell, i) => {
      const cellObj = typeof cell === 'string' ? { text: cell } : cell;
      const fill = cellObj.fill || (zebra && ri % 2 === 1 ? OFF_WHITE : WHITE);
      return new TableCell({
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: columns[i].align || AlignmentType.LEFT,
          children: [new TextRun({ text: cellObj.text || '', size: 19, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })],
        })],
      });
    }),
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows],
  });
}

function colorBanner(color, height = 200) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })],
  });
}

// ---------- Header / Footer ----------
function makeHeader() {
  return new Header({ children: [new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2400, CONTENT_W - 2400],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 158, height: 33 } })] })] }),
      new TableCell({
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Managed PKI — Deployment Options', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  CONFIDENTIAL  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ],
  })] });
}

// =====================================================================
// DOCUMENT BODY
// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 264, height: 55 } })] }),
  spacer(400),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2000, 5360, 2000],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})],
  }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Managed Hardware-Backed PKI', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Three Deployment Models', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A Hardware-Rooted Certificate Authority for CardLogix Credentials', size: 28, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Hosting & Operating Options for a CardLogix + Technijian Joint Offering', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(160),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for CardLogix', size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Attn: Nick Schooler, Business Development', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Document version 1.0  ·  Pricing current as of June 2026', size: 20, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(520),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for CardLogix. All figures are list-price estimates and must be validated against live provider pricing before any customer quotation.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  plainHeader('Table of Contents'),
  new TableOfContents('Right-click → Update Field to refresh page numbers', { hyperlink: true, headingStyleRange: '1-1' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '3', label: 'Deployment models, one security bar', color: CORE_BLUE },
    { number: 'FIPS 140-3', label: 'Level 3 HSMs in every model', color: TEAL },
    { number: '~$1.9K–$42K', label: 'Infrastructure: self-hosted to cloud', color: CORE_ORANGE },
    { number: 'Oct 2024', label: 'CJIS phishing-resistant MFA mandate', color: PASS },
  ]),
  spacer(300),
  p('This document lays out three practical ways to deliver a managed, hardware-backed Public Key Infrastructure (PKI) — a Certificate Authority (CA) whose signing key lives inside tamper-resistant hardware — to issue and protect the certificate-based credentials carried on CardLogix smart cards. The goal is to give CardLogix a clear, side-by-side view so the right hosting and operating model can be chosen for each customer.'),
  p('In all three models the security guarantee is identical: a single-tenant, FIPS 140-3 Level 3 Hardware Security Module (HSM) generates the CA signing key inside hardware, where it can never be extracted — even by the people operating the system. The models differ on four things that matter commercially: where the system runs, who operates it day to day, who holds the CJIS compliance paperwork, and what the infrastructure costs.'),
  p('One honest point shapes the whole picture. The FBI CJIS Security Policy requires FIPS-validated encryption and phishing-resistant multi-factor authentication (mandatory since October 1, 2024) — and that requirement is satisfied by certificate-based PKI or by FIDO2. CJIS does not require an agency to run its own HSM-backed CA. So a hardware-rooted CA is best positioned as a premium, auditable differentiator CardLogix can sell — "trust the hardware that signs the card" — and a managed service Technijian operates, rather than a box every agency is forced to buy.'),
  spacer(100),
  calloutBox(
    'What Is the Same in Every Model',
    [
      'Single-tenant, FIPS 140-3 Level 3 HSM. The CA signing key is generated in hardware and is non-extractable — no operator, and no cloud provider, can read it out.',
      'Technijian builds the platform and provides the 24/7 managed wrap: monitoring, backup verification, key-custodian ceremony, certificate lifecycle, and audit evidence.',
      'CardLogix credentials (PIV, FIDO2, FRAC) drop into a CJIS-ready home, sold as one managed package rather than a pile of parts the customer has to assemble.',
    ],
    TEAL
  ),
  spacer(120),
  p('Recommendation in one line: default to Option 2 (CardLogix-hosted, Technijian-operated) for the lowest cost and the most control; step up to Option 3 (government cloud) for large or state agencies whose procurement demands a hyperscaler; and use Option 1 (Technijian-hosted) when CardLogix prefers zero infrastructure and operational involvement. The sections that follow detail each.'),
);

// ---------- 02 WHAT WE'RE PROTECTING + WHAT CJIS REQUIRES ----------
docChildren.push(
  ...sectionHeader('What We Are Protecting & What CJIS Actually Requires', CORE_BLUE, '02'),
  spacer(100),
  p('A certificate-based smart card stores a private key and a digital certificate. The cardholder’s private key is generated on the card and never leaves it — so it is already protected, and a stolen certificate (the public half) is harmless on its own. The component that needs hardening is the CA’s signing key: the key the Certificate Authority uses to sign every credential it issues. If that key sits in software on a server and the server is breached, an attacker can forge credentials for anyone in the organisation. Moving it into an HSM closes that gap — the key is generated inside the hardware, the CA can ask the HSM to sign, but the key itself can never be read out.'),
  spacer(120),
  subHeader('What CJIS Requires — and What It Does Not'),
  leadBullet('FIPS-validated encryption. ', 'CJIS requires that Criminal Justice Information be protected with FIPS 140-validated cryptography. Validation means a module on the NIST CMVP list — not simply "uses strong algorithms."'),
  leadBullet('Phishing-resistant MFA. ', 'CJIS 5.9.5 made advanced, phishing-resistant authentication mandatory as of October 1, 2024; CJIS 6.0 (December 2024) aligned the policy to NIST 800-53 Rev 5. This requirement is met by certificate-based PKI or by FIDO2 — exactly the credentials CardLogix manufactures.'),
  leadBullet('No HSM mandate. ', 'Nothing in CJIS requires an agency to operate its own CA or own a FIPS 140-3 Level 3 HSM. That means the hardware-rooted CA is an optional, sellable upgrade — a stronger trust story — not a universal compliance checkbox.'),
  spacer(100),
  p('Timing favours the offering. FIPS 140-2 certificates move to the NIST historical list in September 2026, making FIPS 140-3 the forward-looking standard. As of June 2026 a FIPS 140-3 Level 3 HSM is available at a price point (about $950 per unit) that makes self-hosting genuinely viable for the first time — which is what puts Options 1 and 2 below within reach.'),
  spacer(100),
  calloutBox(
    'Why This Matters Commercially',
    [
      'A smart card is only as trustworthy as the CA that signs its certificates. A software-held CA key is the single point of total compromise in an otherwise hardware-rooted system.',
      'Moving the CA key into hardware turns "trust our cards" into "trust the hardware that signs them" — a stronger, auditable claim CardLogix can sell, and one Technijian operates and stands behind.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 03 THE THREE MODELS AT A GLANCE ----------
docChildren.push(
  ...sectionHeader('The Three Deployment Models — At a Glance', CORE_BLUE, '03'),
  spacer(100),
  p('All three models deliver the same security. The choice is about hosting, operations, compliance paperwork, cost, and how a given customer’s procurement team prefers to buy. The table below summarises; the sections that follow detail each model.'),
  spacer(120),
  buildTable(
    [
      { label: 'Dimension', weight: 2.3 },
      { label: 'Option 1 — Technijian-Hosted', weight: 2.7 },
      { label: 'Option 2 — CardLogix-Hosted', weight: 2.7 },
      { label: 'Option 3 — Gov Cloud', weight: 2.6 },
    ],
    [
      ['Where it runs', 'Technijian secure datacenter', 'CardLogix secure facility', 'AWS GovCloud / Azure Government'],
      ['HSM', '2× YubiHSM 2 FIPS (140-3 L3)', '2× YubiHSM 2 FIPS (or existing)', 'Cloud HSM (AWS / Azure)'],
      ['Infrastructure cost', { text: '~$1,900 one-time', bold: true, color: PASS }, { text: '~$1,900 one-time', bold: true, color: PASS }, { text: '~$25K–$42K / year', bold: true, color: CORE_ORANGE }],
      ['One-time build', '~$20K–$37K', '~$15K–$30K', '~$20K–$40K'],
      ['Operated by', 'Technijian', 'Technijian (on CardLogix platform)', 'Technijian'],
      ['CJIS addendum / clearances', 'Technijian', 'CardLogix (Technijian flow-down)', 'CardLogix (Technijian flow-down)'],
      ['Procurement credibility', 'Moderate', 'Strong (GSA / FIPS 201 maker)', 'Strongest (FedRAMP High + CJIS)'],
      ['Customer relationship', 'Technijian-led; CardLogix resells', 'CardLogix-led', 'CardLogix-led'],
      ['Best fit', 'CardLogix wants zero infra burden', 'Lowest cost; keep crypto in-house', 'Large / state agency procurement'],
    ],
  ),
  spacer(140),
  p('Read the cost rows together with Section 7: the infrastructure line is only part of the picture, and across all three models the recurring expense is dominated by skilled operations and audit, not by the hardware.', { size: 20, italics: true }),
);

// ---------- 04 OPTION 1 ----------
docChildren.push(
  ...sectionHeader('Option 1 — Technijian-Hosted & Managed', TEAL, '04'),
  spacer(100),
  p('The full service runs inside Technijian’s own secure datacenter. Technijian builds the PKI, protects the CA signing key in our own FIPS 140-3 Level 3 hardware, operates it 24/7, and holds the CJIS paperwork. CardLogix resells the service alongside its smart cards as a single managed package, with no infrastructure or operational involvement of its own.'),
  spacer(120),
  subHeader('How It Works'),
  leadBullet('Offline root + online issuing CA. ', 'An air-gapped root CA signs the online issuing CA; both signing keys are generated inside YubiHSM 2 FIPS modules (FIPS 140-3 Level 3, NIST CMVP certificate #5302).'),
  leadBullet('Technijian operates end to end. ', 'Provisioning, monitoring, backup verification, certificate lifecycle, and the key-custodian ceremony all sit with our team.'),
  leadBullet('CardLogix resells. ', 'The cards and the managed PKI are sold together; the customer holds one relationship and one bill.'),
  spacer(120),
  subHeader('Cost, Compliance & Fit'),
  leadBullet('Infrastructure: ', 'about $1,900 one-time for the HSM pair, plus modest hosting. A third HSM for the offline root and disaster recovery brings the hardware to about $2,850.'),
  leadBullet('One-time build: ', 'about $20,000–$37,000 (HSMs, hardened CA host, root-key ceremony, templates, runbooks), then the recurring Technijian managed-service fee.'),
  leadBullet('CJIS scope: ', 'Technijian holds the CJIS Security Addendum and clears the engineers who operate the platform — a near-term build for us (see Section 8).'),
  leadBullet('Best fit: ', 'when CardLogix wants to stay purely on the hardware and resale side, and let Technijian own the infrastructure and operations entirely.'),
);

// ---------- 05 OPTION 2 ----------
docChildren.push(
  ...sectionHeader('Option 2 — CardLogix-Hosted, Technijian-Operated', TEAL, '05'),
  spacer(100),
  p('The PKI runs inside CardLogix’s own secure facility, on the credential-issuance capability CardLogix already operates. As a NIST-certified, GSA-approved (HSPD-12 / FIPS 201) smart-card manufacturer, CardLogix already runs a Card Management System (the Versasec vSEC:CMS line it offers), key-management, and HSM-based personalization inside a physically secure environment. Adding a hardware-rooted CA to that environment is an incremental step, not a greenfield build. CardLogix owns the platform and holds the CJIS paperwork; Technijian provides the build and the 24/7 managed operations under a flow-down agreement.'),
  spacer(120),
  subHeader('How It Works'),
  leadBullet('Keep the crypto core in-house. ', 'The CA signing key is generated and held in CardLogix’s facility — in 2× YubiHSM 2 FIPS modules, or on CardLogix’s existing HSMs if they meet the FIPS 140-3 bar.'),
  leadBullet('Technijian operates it. ', 'Our team runs the day-to-day — monitoring, backup verification, lifecycle, and incident response — on CardLogix’s platform, remotely and under CardLogix’s compliance umbrella.'),
  leadBullet('CardLogix owns the relationship. ', 'CardLogix is the platform owner and the customer-facing brand; Technijian is the operating partner behind it.'),
  spacer(120),
  subHeader('Cost, Compliance & Fit'),
  leadBullet('Infrastructure: ', 'about $1,900 one-time for the HSM pair — or close to zero net-new if CardLogix’s existing HSMs are used. This is the lowest-cost model.'),
  leadBullet('One-time build: ', 'about $15,000–$30,000 — lower than Option 1 because it builds on the CMS and secure facility CardLogix already has.'),
  leadBullet('CJIS scope: ', 'CardLogix holds the CJIS Security Addendum and the secure facility; Technijian’s cleared engineers operate under a flow-down, which reduces the standalone compliance lift for both parties.'),
  leadBullet('Best fit: ', 'the default for cost-sensitive deployments, and where keeping the signing key inside CardLogix’s own trusted manufacturing environment is itself part of the trust story.'),
  spacer(100),
  calloutBox(
    'Why This Is Often the Natural Choice',
    [
      'CardLogix already manufactures FIPS 201 credentials in a secure facility with card-management and HSM-based key handling. The cryptographic muscle is largely in place.',
      'Technijian supplies exactly what a manufacturer typically does not run — the 24/7 monitoring, lifecycle, and audit discipline of a managed service. Each partner does what it already does best.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 OPTION 3 ----------
docChildren.push(
  ...sectionHeader('Option 3 — Government Cloud, CardLogix-Owned, Technijian-Operated', TEAL, '06'),
  spacer(100),
  p('The PKI runs in AWS GovCloud (US) or Azure Government, inside a cloud account owned by CardLogix, with the CA signing key held in the provider’s cloud HSM. Technijian builds and operates it. This model trades a higher infrastructure cost for the strongest procurement story: the government clouds arrive with FedRAMP High authorisation and CJIS agreements already in place across most states, which large and state-level agencies increasingly expect to see in a bid.'),
  spacer(120),
  subHeader('How It Works'),
  leadBullet('Cloud HSM holds the CA key. ', 'AWS CloudHSM (offered in GovCloud for CJIS workloads) or Azure Cloud HSM provides single-tenant, FIPS 140-3 Level 3 key storage, with the CA on a hardened virtual machine alongside it.'),
  leadBullet('CardLogix owns the tenant. ', 'The cloud account, the key custody, and the CJIS agreement sit with CardLogix; Technijian operates the environment.'),
  leadBullet('Private link to the agency. ', 'A dedicated connection ties the cloud CA back to the agency’s on-premises directory for enrolment and credential distribution.'),
  spacer(120),
  subHeader('Cost, Compliance & Fit'),
  leadBullet('Infrastructure: ', 'about $25,000–$42,000 per year for the cloud HSM, before the managed-service fee. Government-cloud rates carry a premium over commercial list pricing — validate the GovCloud figure before quoting.'),
  leadBullet('One-time build: ', 'about $20,000–$40,000 for the cloud architecture, CA build, and private connectivity.'),
  leadBullet('CJIS scope: ', 'CardLogix owns the tenant and the addendum; administrators with logical access still require FBI fingerprint clearance and CJIS training, which the government clouds explicitly mandate.'),
  leadBullet('Best fit: ', 'large or state agencies whose procurement requires a hyperscaler’s compliance posture, and customers already standardised on a government cloud.'),
);

// ---------- 07 COST COMPARISON ----------
docChildren.push(
  ...sectionHeader('Cost Comparison (All Three Models)', CORE_ORANGE, '07'),
  spacer(100),
  p('The table below consolidates the infrastructure economics. All figures are list-price estimates as of June 2026 and must be validated against live pricing before any customer quotation. They exclude Technijian’s managed-service fee, which is scoped per engagement and is where the durable value of the offering sits.'),
  spacer(120),
  buildTable(
    [
      { label: 'Cost element', weight: 2.6 },
      { label: 'Option 1 — Technijian DC', weight: 2.5 },
      { label: 'Option 2 — CardLogix DC', weight: 2.5 },
      { label: 'Option 3 — Gov Cloud', weight: 2.4 },
    ],
    [
      ['HSM hardware (one-time)', '~$1,900 (2× YubiHSM 2 FIPS)', '~$1,900 or reuse existing', 'n/a (rented monthly)'],
      ['Recurring infrastructure', 'Minimal (hosting, power)', 'Minimal (existing facility)', { text: '~$25K–$42K / year', bold: true, color: CORE_ORANGE }],
      ['One-time build', '~$20K–$37K', { text: '~$15K–$30K', bold: true, color: PASS }, '~$20K–$40K'],
      ['Managed-service fee', 'Scoped at discovery', 'Scoped at discovery', 'Scoped at discovery'],
      [{ text: '3-year infra subtotal*', bold: true }, { text: '~$2K + build', bold: true, color: CORE_BLUE }, { text: '~$2K + build', bold: true, color: CORE_BLUE }, { text: '~$75K–$126K + build', bold: true, color: CORE_ORANGE }],
    ],
  ),
  spacer(80),
  p('*Infrastructure only (HSM + cloud HSM rent over three years), excluding build and managed-service fees. The self-hosted hardware in Options 1 and 2 is a one-time purchase that serves many customers; the cloud HSM in Option 3 is a per-deployment annual rental.', { size: 19, italics: true }),
  spacer(160),
  subHeader('Option 3 Detail — Cloud HSM, Corrected June 2026 Pricing'),
  buildTable(
    [
      { label: 'Cloud HSM', weight: 3 },
      { label: 'Configuration', weight: 4 },
      { label: 'Est. annual (USD)', weight: 2.2, align: AlignmentType.RIGHT },
    ],
    [
      ['AWS CloudHSM', 'hsm2m.medium high-availability pair (commercial)', { text: '~$25,400–$28,000', align: AlignmentType.RIGHT }],
      ['Azure Cloud HSM', 'Luna-based, 3-node HA cluster (commercial)', { text: '~$42,000', align: AlignmentType.RIGHT }],
      ['Government-cloud premium', 'GovCloud / Azure Government rates run higher', { text: 'Validate before quoting', align: AlignmentType.RIGHT, color: CORE_ORANGE }],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Cost Truth: Operations, Not Hardware',
    [
      'Across all three models, the recurring expense is dominated by skilled operations and audit — roughly a 0.15–0.25 full-time engineer plus periodic audit — not by the HSM. The hardware is frequently the smallest line.',
      'This is good news: it means the offering should be priced on the managed wrap Technijian delivers, and the choice between self-hosted and cloud hardware moves the smaller of the two cost drivers.',
    ],
    TEAL
  ),
  spacer(140),
  subHeader('Per-Credential Economics'),
  p('For the bundled card-plus-credential price, useful anchors: a dual-interface PIV card runs roughly $5–$25 in hardware; the U.S. government’s shared PIV issuance service (GSA USAccess) runs under $40 per cardholder per year fully loaded; and the government’s own all-in benchmark for a managed PIV credential is about $226 over five years. These frame where a competitive managed-credential price should land.'),
  spacer(120),
  calloutBox(
    'How Agencies Fund This',
    [
      'A thin operating budget does not mean no money. The State and Local Cybersecurity Grant Program (about $1B across FY2022–2025, with at least 80% passed through to local governments) explicitly funds authentication devices, MFA software, and identity-and-access-management systems.',
      'Byrne JAG, COPS technology grants, and the Homeland Security Grant Program are additional, established funding routes for law-enforcement identity and cybersecurity — a practical talking point for CardLogix’s agency conversations.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 COMPLIANCE PICTURE ----------
docChildren.push(
  ...sectionHeader('The Compliance Picture — CJIS Scope Follows Access', CORE_BLUE, '08'),
  spacer(100),
  p('The most important compliance principle is simple: CJIS scope follows access, not ownership. Whoever has logical or physical access to the systems and data must pass an FBI fingerprint-based background check, complete CJIS security training, and operate under a signed CJIS Security Addendum with the agency or its state CJIS Systems Agency. Where the hardware physically sits matters less than who can touch it.'),
  spacer(100),
  p('That principle is what makes the hosting choice strategic. Each model places the compliance burden differently:'),
  spacer(60),
  leadBullet('Option 1: ', 'Technijian holds the addendum and clears its operating engineers.'),
  leadBullet('Options 2 and 3: ', 'CardLogix is the platform owner and addendum holder; Technijian’s engineers operate under a flow-down agreement, riding CardLogix’s addendum and (in Option 2) its secure facility rather than standing up a separate compliance programme.'),
  spacer(120),
  subHeader('An Honest Note on Technijian’s CJIS Readiness'),
  p('Technijian has not yet delivered a CJIS engagement — we want to be straight about that. What we do have is most of the foundation: roughly ten of the thirteen CJIS policy areas are already covered by our existing stack (Entra ID with conditional access, Microsoft Defender, our 24/7 security operations, insider-risk monitoring, and a mature CMMC practice built on the same NIST 800-53 control families CJIS 6.0 now references). Standing up a formal CJIS wrapper is a defined, near-term build of roughly $25,000–$40,000 over about three months, gated mainly by personnel clearance timelines. The flow-down structure in Options 2 and 3 reduces that lift by letting Technijian operate inside CardLogix’s compliance envelope.'),
);

// ---------- 09 COMMERCIAL MODEL ----------
docChildren.push(
  ...sectionHeader('Commercial Model — Who Does What', TEAL, '09'),
  spacer(100),
  p('The partnership divides cleanly along what each company already does well. CardLogix brings the credentials and, in Options 2 and 3, the hosting platform, the brand, and the customer relationship. Technijian brings the build and the ongoing managed operations — the part a credential manufacturer typically does not staff.'),
  spacer(140),
  subHeader('Resale Mechanics'),
  leadBullet('Government cloud (Option 3): ', 'CardLogix owns the cloud account; resale and billing run through the Microsoft Cloud Solution Provider programme (Azure) or the AWS Partner Network / Marketplace (AWS), with Technijian operating the environment.'),
  leadBullet('Self-hosted (Options 1 and 2): ', 'no cloud account is involved; the offering is packaged and priced directly as a managed subscription.'),
  spacer(140),
  subHeader('Suggested Packaging'),
  p('A clean way to present this to an end customer is a one-time setup fee plus a recurring monthly managed-PKI subscription. Specific figures are scoped at discovery — the structure is what matters here.'),
  spacer(60),
  buildTable(
    [
      { label: 'Element', weight: 2.6 },
      { label: 'What It Covers', weight: 4.2 },
      { label: 'Pricing Approach', weight: 2.6 },
    ],
    [
      ['One-time onboarding', 'Architecture, HSM provisioning, CA build, root-key ceremony, initial card issuance', 'Fixed project fee'],
      ['Managed-PKI subscription', 'Infrastructure + 24/7 monitoring, backup verification, patching, renewals', 'Monthly per-CA fee'],
      ['Per-credential', 'Issuance and lifecycle of each smart-card credential', 'Per-card fee, bundled with CardLogix hardware'],
      ['Incident / change requests', 'Revocation, re-issuance, template changes, audit support', 'Included allotment + hourly overage'],
    ],
  ),
  spacer(120),
  p('The durable value — and the part that protects the end customer — is the managed wrap: backups verified, keys recoverable, certificates fresh, and the audit trail intact. That wrap is identical across all three models; only the hosting underneath it changes.'),
);

// ---------- 10 RECOMMENDATION & NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('Recommendation & Next Steps', DARK_CHARCOAL, '10'),
  spacer(100),
  leadBullet('Default to Option 2 — CardLogix-hosted, Technijian-operated. ', 'It is the lowest-cost model, it keeps the signing key inside CardLogix’s own trusted facility, it leverages the card-management capability CardLogix already runs, and it puts CardLogix in control of the platform and the customer relationship.'),
  leadBullet('Step up to Option 3 — government cloud — for large or state agencies ', 'whose procurement expects a hyperscaler’s FedRAMP-High and CJIS posture, accepting the higher infrastructure cost as the price of that credibility.'),
  leadBullet('Hold Option 1 — Technijian-hosted — for ', 'customers where CardLogix prefers to stay purely on the hardware and resale side with no infrastructure of its own.'),
  spacer(120),
  subHeader('Recommended Next Steps'),
  ...numberedSteps([
    'Confirm whether CardLogix already operates a CA and signing HSM for issuance today, and whether CardLogix would prefer to be the platform owner (Options 2 / 3) or have Technijian host (Option 1).',
    'Pick the model for the first target customer based on their size and procurement expectations.',
    'Validate current HSM and cloud pricing and any partner discounts, and finalise the managed-PKI subscription price.',
    'Run a pilot: build the offline root and the HSM-backed issuing CA, and issue a small batch of CardLogix cards before any production rollout.',
    'Define the support SLA, the backup and disaster-recovery runbook, and the key-custodian ceremony as part of onboarding.',
  ]),
  spacer(160),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
      borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Let’s put a hardware-rooted CA behind every CardLogix card.', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Proposed next step: a 45-minute joint working session to choose the model and scope a pilot.', size: 20, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500  |  technijian.com', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
  spacer(160),
  p('Prepared as a planning and evaluation document for the CardLogix + Technijian partnership. All cost figures are list-price estimates as of June 2026 and must be validated against current provider pricing before any customer quotation.', { italics: true, size: 20 }),
);

// ---------- 11 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '11'),
  spacer(100),
  p('Technijian is an AI-forward managed IT and cybersecurity firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We design, build, and operate secure infrastructure — including identity, PKI, and HSM-backed cryptographic services — with security built in, not bolted on. Our dedicated-pod model means a team that knows your environment, backed by 24/7 support from our U.S. and India offices.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'Role in a Managed-PKI Offering', weight: 5 }],
    [
      ['My Security', 'HSM provisioning, CA architecture, key-custodian ceremonies, and the hardening and access governance behind the signing key'],
      ['My IT', '24/7 monitoring, patching, backup verification, and lifecycle operations for the CA host and connectivity'],
      ['My Cloud', 'AWS and Azure deployment, partner billing, and the private-link networking between cloud and on-premises directories'],
      ['My Compliance', 'Audit logging, evidence, and access review supporting the customer’s CJIS posture for credential issuance'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Primary contact', 'Ravi Jain, Founder & CEO — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
  spacer(160),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technology as a solution', size: 22, italics: true, color: CORE_BLUE, font: FONT_HEAD })] }),
);

// =====================================================================
// DOCUMENT ASSEMBLY
// =====================================================================
const doc = new Document({
  features: { updateFields: true },
  numbering: { config: [{
    reference: NUM_BULLETS,
    levels: [{
      level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } },
    }],
  }]},
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD },
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

const OUT_PATH = path.join(__dirname, 'CardLogix-Managed-PKI-Deployment-Options.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
